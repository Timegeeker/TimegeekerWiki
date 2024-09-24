在并发编程中，**由于 CPU 缓存的存在**以及**编译器和处理器的优化**，会导致**内存可见性问题**和**指令重排序问题**。为了解决这些问题，Java 引入了 `volatile` 关键字，提供了一种轻量级的同步机制。`volatile` 用于确保共享变量的**内存可见性**，并防止指令重排序，特别适用于状态标志和开关类的简单场景。

## 一、volatile 的特性

**内存可见性**：对`volatile`变量的写操作会被立即刷入主内存，读操作会从主内存读取最新的值。

-  `volatile` **写操作**：当一个线程写入一个 `volatile` 变量时，根据 Java 内存模型，它会强制将该线程对这个变量的修改**立即刷新到主内存**，并且保证该写操作之前的所有其他写操作（对共享变量的写入）也被刷新到主内存。  
- `volatile` **读操作**：当一个线程读取一个 `volatile` 变量时，将该线程对应的本地变量失效，强制该线程从主内存中获取该变量的最新值，并且**保证之前的所有写操作对该线程可见**。

**禁止指令重排**：`volatile`防止编译器和处理器对 `volatile 变量` 的读写操作进行指令重排，确保程序的执行顺序符合预期，提供一定程度的有序性。

通过将 volatile 变量的单个读/写理解成使用同一个锁对单个读/写做了同步能够更好地理解 volatile 的特性。

```java
public class VolatileFeaturesDemo {
    public volatile long val;

    public void set(long v){
        val = v;
    }

    public void increment(){
        val++;
    }

    public long get(){
        return val;
    }

}
```

与 volatile 特性等同的代码：

```java
class VolatileFeatureEqualDemo{
    public long val;

    public synchronized void set(long v){
        val = v;
    }
    public void  increment(){
        long temp = get();
        temp += 1;
        set(temp);
    }

    public synchronized long  get(){
        return val;
    }
    
}
```

## 二、实现原理

在保守的实现中，当程序包含 `volatile` 变量时，编译器在生成字节码时会在 `volatile` 变量的读写操作前后插入内存屏障指令，确保操作的顺序性和内存的可见性。具体的内存屏障插入规则如下：

- `volatile` **读操作**：在 `volatile` 变量的读操作之后，依次插入 **LoadLoad 屏障** 和 **LoadStore 屏障**。这确保在 `volatile` 变量读取后，所有后续的读写操作都不会被重排序到该 `volatile` 读操作之前，保证读取到的值是最新的。
- `volatile` **写操作**：在 `volatile` 变量的写操作之前，插入 **StoreStore 屏障**，在写操作之后，插入 **StoreLoad 屏障**。这确保 `volatile` 变量的写操作之前的所有写操作必须在 `volatile` 写操作前完成，并且写操作的结果对其他处理器可见后，才允许进行后续的读写操作。

内存屏障的作用不仅是防止指令重排序，还确保屏障前的写操作（尤其是 `Store` 类型）在执行后对其他处理器可见。具体的结论如下：

- 如果第二个操作是 `volatile` 写操作，那么所有之前的操作都不能重排序到该 `volatile` 写操作之后。同时，如果有其他非 `volatile` 的写操作，这些写操作必须先刷新到主存，使其对其他处理器可见，才能执行 `volatile` 写操作后的指令。
- 如果第一个操作是 `volatile` 读操作，那么无论后续的操作是什么，必须在 `volatile` 读操作完成并获取到最新的共享变量值后，才能执行后续的操作。这保证了读取到的 `volatile` 变量值是最新的，并且避免后续操作与前面的读操作发生顺序错乱。

通过上述原理，我们可以明确理解为什么在以下代码中，当线程 A 执行完 `writer` 方法后，线程 B 能够读取到 `val` 变量的最新值：

```java
public class VolatileDemo {
    private int val;
    private volatile boolean flag = false;

    public void writer(){
        val = 24;
        // StoreStore
        flag =true;
        // StoreLoad
    }

    public void reader(){
        if (flag){
            // LoadLoad
            // LoadStore
            System.out.println(val);
        }
    }
}
```

- **在** `writer` **方法中**，由于 `flag` 是 `volatile` 变量，编译器在生成字节码时会在 `flag` 的写操作之前插入 **StoreStore 屏障**。这意味着 `val` 的写操作发生在屏障之前，保证了 `val = 24` 的写入操作在 `flag = true` 之前完成，形成了 **Happens-Before** 关系，即 `val=24` Happens-Before `flag = true` 。此后，`flag` 的写操作会立即刷新到主存，并对其他线程可见。
- **在** `reader` **方法中**，由于 `flag` 是 `volatile` 变量，`flag` 的读操作后插入了 **LoadLoad** 和 **LoadStore** 屏障，保证 `flag` 的读取操作在后续的 `val` 读取操作之前发生。所以，`flag == true` 的判断成立后，`val` 的值必然是线程 A 写入的最新值 `24`。

从这里，你有没有看出来这正是 **Happens-Before** 原则中的 **volatile 变量规则**的实现原理。
