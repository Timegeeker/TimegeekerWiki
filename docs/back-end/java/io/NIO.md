Java NIO 在 Java 1.4 引入，目的是解决传统 I/O 的性能和灵活性问题。Java NIO 的主要特点在于：

- **非阻塞 I/O**：传统 Java I/O 是阻塞式的，而 NIO 引入了非阻塞机制，允许在 I/O 操作过程中不等待，直接处理其他任务。

- **基于缓存区操作**：Java NIO 采用缓存区（Buffer）来存储和传输数据，与传统 I/O 直接操作流不同。
- **多路复用机制**：Java NIO 引入了 Selector 机制来管理多个通道（Channel），这种方式适合于处理大量连接的服务器。

这里有一个问题非常重要——什么是阻塞式 I/O ，什么是非阻塞式 I/O？

所谓的阻塞式 I/O（BlO）是当程序在执行 I/O 操作的时候，例如调用一个读操作或一个写操作的时候，线程会进行阻塞直至 I/O 操作的成功完成。

所谓的非阻塞式 I/O（NIO）是在执行 I/O 操作时，线程不会被阻塞，可以立即返回并继续执行其他任务。线程需要轮询或通过回调机制来检查操作是否完成。

## 一、 NIO 的核心组件

Java NIO 有几个核心组件：**Channel**、**Buffer**、**Selector**。每个组件在设计上都有独特的目的和用法。

### 1. Channel（通道）

**Channel** 是 NIO 的基础接口，它代表到数据源的一个连接，类似于传统 I/O 的流（Stream）。但是与流不同，Channel 是双向的，可以进行读、写或两者同时操作。

NIO 中主要的实现类有：

- **FileChannel**：用于文件的数据读取和写入。
- **SocketChannel**：用于 TCP 连接读写网络数据。
- **ServerSocketChannel**：用于监听新进来的 TCP 连接，就像传统的服务器套接字。。
- **DatagramChannel**：用于通过 UDP 读写网络数据。

Channel 的工作原理是为Channel 工作在缓存区（Buffer）上，所有与 Channel 相关的 I/O 操作都通过缓冲区进行。Channel 读取数据时，会将数据放入缓冲区，而写入数据时，会从缓冲区中取出数据。Channel 的非阻塞模式使得它们可以在数据未准备好时立即返回，而不是等待数据准备好。

### 2. Buffer

与传统 I/O 直接读取或写入数据不同，NIO 使用 Buffer 作为与 Channel 交互的数据容器。Buffer 本质上是一个内存块，负责数据的存储、写入、读取等操作。

Buffer 中存在四个比较重要的属性：

- **capacity**：缓冲区的容量，表示最多可以容纳的数据量。
- **position**：下一个读或写操作的索引。
- **limit**：表示当前可以操作的数据的最大位置（Buffer 中第一个不能读或写的元素索引）。
- **mark**：一个用于记录当前 position 的标记。 通过调用 `mark() `方法设置，调用 `reset()` 方法恢复到该位置。

Java 提供了多种类型的 Buffer，例如 `ByteBuffer`、`CharBuffer`、`IntBuffer` 等。其中 `ByteBuffer` 是最常用的，因为它直接支持与操作系统内存交互。而它们根据底层实现的不同是分为两种类型的，一种为 `Heap Buffer` ，分配在 JVM 的堆内存中，受垃圾回收（GC）管理。另外一种是 `Direct Buffer` ，分配在操作系统的直接内存中，通过 `Unsafe` 类管理，减少了数据在 JVM 和系统内存之间的拷贝。

那么应该如何使用 Buffer 呢？具体的**使用流程**如下：

- 分配 Buffer：使用 `Buffer` 中的 `allocate` 方法分配一个指定容量的 Buffer。
- 从 Channel 中写入数据：向 Buffer 中写入数据，例如 channel.read(buffer)。
- 切换为读模式：使用 Buffer 的 `flip()` 方法由写模式切换为读模式。
- 从 Buffer 读取数据：可以使用 Buffer 提供的 `get()` 方法。
- 切换为写模式（清理 Buffer）：使用 `clear()` 或 `compact()` 方法重置 Buffer，以便再次写入数据。
  - `clear()` ：重置 `postion` 为 0 ，limit 为 `capacity`。相当于全部清除，无论 Buffer 中的数据是否全部读取完整。
  - `compact()` ：将所有未读的数据移到 Buffer 的开始处，然后将 `position` 设置为未读数据的下一个下标，limit 设置为 `capacity`。

示例代码：

```java
import java.nio.ByteBuffer;

public class BufferExample {
    public static void main(String[] args) {
        // 1. 分配Buffer
        ByteBuffer buffer = ByteBuffer.allocate(10);
        
        // 2. 写入数据到Buffer
        for (int i = 0; i < buffer.capacity(); i++) {
            buffer.put((byte) i);
        }
        
        // 3. 准备读操作（切换为读模式）
        buffer.flip();
        
        // 4. 读取数据从Buffer
        while (buffer.hasRemaining()) {
            System.out.println(buffer.get());
        }
        
        // 5. 清理Buffer（重置Buffer以便再次写入数据）
        buffer.clear();
        
        // 再次写入数据
        for (int i = 10; i < 20; i++) {
            buffer.put((byte) i);
        }
        
        // 准备读操作（切换为读模式）
        buffer.flip();
        
        // 读取数据从Buffer
        while (buffer.hasRemaining()) {
            System.out.println(buffer.get());
        }
    }
}
```

掌握 Buffer 的结构以及不同状态下的情况有助于从本质上理解 Buffer 具体的操作流程，以下为 Buffer 不同状态下的结构：

- 初始化状态：此时 Buffer 为写模式，position 代表第一个要写入的元素的索引，limit 代表的是一旦 position 等于 limit 无法再往 Buffer 中写入数据，表示此时 Buffer 已满。

![](/buffer-1.png)

- 写入数据：往 Buffer 中写入数据 JAVA 四个元素，此时 position 所在的索引 4 为下一个写入数据的索引，（limit - position）代表还可以写入多少个元素。

![](buffer-2.png)

- 切换为读模式：此时 position 的下一个读取元素的索引，limit 为读取限制索引。

![](buffer-3.png)

- 读取元素：读取前两个元素，position 指针向前移动两个单位。

![](buffer-4.png)

- 切换为写模式：
  - 方式一： 采用  `clear` 方法，重置 `postion` 为 0，limit 为 `capacity`。相当于全部清除，无论 Buffer 中的数据是否全部读取完整。
  - 方式二：采用 `compact` 方法，将所有未读的数据移到 Buffer 的开始处，然后将 `position` 设置为未读数据的下一个未知，limit 设置为 `capacity`。

![](/buffer-5.png)

![](/buffer-6.png)

### 3. Selector

Selector 是 Java NIO 的一个重要组件，它允许单个线程监控多个通道（Channel）的 I/O 事件，如连接请求、数据到达等。使用 Selector，可以实现高效的**多路复用**，避免每个连接都创建一个线程，从而提高应用的并发性能。

这里提到了一个重要的概念——多路复用，什么是多路复用呢？

多路复用允许多个输入/输出通道（例如 Socket）共享同一个线程。通过这种方式，可以在一个线程中同时处理多个连接，提高资源利用率和应用的并发性能。在 Java NIO 中，Selector 实现了多路复用机制，一个 Selector 可以同时监控多个 Channel 的 I/O 事件，当某个 Channel 有事件准备好时， Selector 会通知应用程序。

在 NIO 中，I/O 事件有以下几种：

- `OP_ACCEPT`：当服务器端的 Channel 准备好接受一个新的连接时，触发 **接受就绪事件**（`ServerSocketChannel`）
- `OP_CONNECT`：连接已经建立，客户端成功连接上服务端时触发该事件（`SocketChannel`）

- `OP_READ` ：有数据可以读取（`SocketChannel`）
- `OP_WRITE`：可以写数据（`SocketChannel`）

Selector 的使用流程如下：

- **注册通道**： 注册 Channel 到 Selector，并指定感兴趣的事件，事件通过 SelectionKey 对象进行指定（包含了关于通道和 Selector 的信息以及通道感兴趣的操作）。 当有事件发生时，Selector 会将准备好进行 I/O 操作的 SelectionKey 返回给应用程序，然后由应用程序遍历这些 SelectionKey 并处理相应的事件。

```java
SocketChannel socketChannel = SocketChannel.open();
socketChannel.configureBlocking(false);
// 指定感兴趣的事件类型为OP_READ
socketChannel.register(selector, SelectionKey.OP_READ);
```

- **选择就绪通道**： 调用 `select()` 方法，阻塞直到至少有一个通道准备好进行 I/O 操作。

```java
// 返回的是已经就绪的通道的个数
int readyChannels = selector.select();
```

- **处理就绪事件**：遍历返回的 SelectionKey 集合，确定哪些通道准备好进行 I/O 操作，并执行相应的操作。

```java
Set<SelectionKey> selectedKeys = selector.selectedKeys();
Iterator<SelectionKey> keyIterator = selectedKeys.iterator();

while (keyIterator.hasNext()) {
    SelectionKey key = keyIterator.next();
    if (key.isReadable()) {
        // 处理读事件
        SocketChannel channel = (SocketChannel) key.channel();
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        int bytesRead = channel.read(buffer);
        if (bytesRead > 0) {
            buffer.flip();
            // 处理读取的数据
        }
    } else if (key.isAcceptable()) {
        // 处理连接接受事件
        ServerSocketChannel serverChannel = (ServerSocketChannel) key.channel();
        SocketChannel socketChannel = serverChannel.accept();
        socketChannel.configureBlocking(false);
        socketChannel.register(selector, SelectionKey.OP_READ);
    }
    keyIterator.remove();
}
```

以上是 Selector 常见的 API：

- **open**：打开一个 Selector。

- **register**：将一个 Channel 注册到 Selector 上，并指定感兴趣的操作。

- **select**：阻塞等待直到有至少一个通道准备好进行 I/O 操作。
- **selectedKeys**：返回一组 SelectionKey，对应于准备好的通道。

以下通过实现一个简单的服务器-客户端程序来进行测试，服务器接收客户端发送的数据，并将其原样返回给客户端。 

服务器代码：

```java
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

public class EchoServer {

    public static void main(String[] args) throws IOException {
        // 创建 selector 对象
        Selector selector = Selector.open();
        // 创建 serverSocketChannel 对象并进行相应的配置
        ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
        serverSocketChannel.configureBlocking(false);
        serverSocketChannel.bind(new InetSocketAddress(8080));
        // 将 serverSocketChannel 注册到 selector 并绑定 OP_ACCEPT 事件
        serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);

        while(true){
            // 阻塞直到有至少一个通道准备好进行I/O操作
            selector.select();

            // 获取所有准备好I/O操作的SelectionKey
            Set<SelectionKey> selectionKeys = selector.selectedKeys();
            Iterator<SelectionKey> iterator = selectionKeys.iterator();

            while(iterator.hasNext()){
                SelectionKey key = iterator.next();
                iterator.remove();

                if(key.isAcceptable()){
                    // 有新的连接请求
                    ServerSocketChannel serverChannel = (ServerSocketChannel) key.channel();
                    SocketChannel socketChannel = serverChannel.accept();
                    socketChannel.configureBlocking(false);
                    // 注册新连接到Selector，监听读事件
                    socketChannel.register(selector,SelectionKey.OP_READ);
                }else if(key.isReadable()){
                    // 有数据可以读取
                    SocketChannel socketChannel = (SocketChannel) key.channel();
                    ByteBuffer buffer = ByteBuffer.allocate(1024);
                    int byteRead = socketChannel.read(buffer);
                    if (byteRead == -1) {
                        socketChannel.close();
                    }else {
                        buffer.flip();
                        socketChannel.write(buffer);
                        buffer.clear();
                    }
                }
            }
        }
    }
}
```

- 当将 ServerSocketChannel 注册到 Selector 后，每当有事件发生的时候，Selector 获取其中的SelectionKey 对象，根据 SelectionKey 对象可以获取其中的通道对象和具体的事件类型。
- 根据具体的事件类型来执行不同的操作，如果是连接事件，则获取的通道对象为 ServerSocketChannel 对象，利用该对象可以创建一个新的 SocketChannel 用来处理服务器和客户端的连接，并将其注册到 Selector，并指定感兴趣的事件类型；如果是读事件，此时获取的通道对象为处理服务器和客户端的连接 SocketChannel ，由于该示例代码是将接受到的数据发送给客户端，所以将从通道中读取的数据重写写入通道给客户端。

客户端代码：

```java
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SocketChannel;

public class EchoClient {

    public static void main(String[] args) {
        try {
            // 打开SocketChannel
            SocketChannel socketChannel = SocketChannel.open(new InetSocketAddress("localhost", 8080));
            socketChannel.configureBlocking(false);

            // 发送消息
            ByteBuffer buffer = ByteBuffer.allocate(256);
            buffer.put("Hello, Server!".getBytes());
            buffer.flip();
            socketChannel.write(buffer);

            // 读取服务器的回显
            buffer.clear();
            int bytesRead = socketChannel.read(buffer);
            if (bytesRead > 0) {
                buffer.flip();
                System.out.println("Received from server: " + new String(buffer.array(), 0, bytesRead));
            }

            // 关闭连接
            socketChannel.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
```

- 客户端连接上服务器之后，发送"Hello, Server!"字符串给服务器。
- 发送完毕之后，通过 SocketChanne l的 read 方法监听服务器发送过来的数据，最后进行输出。

