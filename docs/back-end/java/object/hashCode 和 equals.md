哈希函数是可以将任意大小的数据映射到固定大小的任何函数，在计算机领域有着广泛的应用，包括构建哈希表、数据检验、负载均衡等。而在Java中，`hashCode()`方法则是为每个对象提供了一个哈希值，通常用于快速查找和存储对象。例如，在使用哈希表（如`HashMap`和`HashSet`）时，`hashCode()`能够提高查询效率。与之密切相关的还有`equals()`方法，它决定了两个对象在**逻辑上**是否相等。

## 概念

`hashCode `方法在Java中最重要的意义是提供一种机制，通过计算对象的哈希码，使对象在基于哈希的集合（如`HashMap`、`HashSet`、`Hashtable`等）中能够**高效地存储和查找**。  

在Java中`hashCode`的定义为：

```java 
public class Object {
    public native int hashCode();
}
```

可以看出此方法调用的是本地方法库中的方法， 其具体实现细节隐藏在JVM的底层代码中，而对于大多数JVM实现来说，`hashCode()`通常基于对象在内存中的地址计算哈希码。然而，在实际开发中，通常会根据对象的内容覆盖`hashCode()`方法，以确保在哈希表中的正确行为和性能。 

你肯定听说过这样一个规范，对于一个类来说，重写`equals`方法必须重写`hashCode`方法，这是为什么呢？这个问题是本文主要探讨的问题，要解决这个问题，需要从Java中的规范说起。

## hashCode 规范

在Java中，`hashCode`和`equals`方法的关系遵循以下契约：

- 如果两个对象根据`equals`方法被认为是相等的，那么它们的`hashCode`必须相等。
  - 换句话说，如果`a.equals(b)`返回true，那么`a.hashCode()`必须等于`b.hashCode()`
  - 这意味着相等的对象必须拥有相同的哈希码。
- 如果两个对象根据`equals`方法不相等，它们的`hashCode`可以相同，也可以不同。
  - 这就是说，不同的对象可以拥有相同的哈希码，但这可能导致哈希冲突。

为什么会有这样的规范呢？我觉得是根据哈希函数的基本设计要求来定义的。对于哈希函数来说，除了需要拥有高效的计算效率，同时如果 `key1 = key2`（代表两个对象相等），那么这两个key通过哈希函数计算出来的哈希值必须相同，如果`key1 ≠ key2`（代表两个对象不相等），理论来说，`hash(key1) ≠ hash(key2) `，但是由于基于哈希算法实现的哈希数据结构，底层使用的是数组，数组的容量是有限的，所以存在哈希冲突的可能性，所以此时存在即使两个key不相等，但是哈希值相等的情况，因此，即使对于两个不相等的对象来说，哈希值也可能存在相等的情况。

## 哈希表的实现和使用

在上面我们提到，哈希表是基于哈希函数来进行实现的，而Java中的`HashMap`、`HashSet`和其他类似的数据结构是基于哈希表的，它们的性能依赖于哈希值的计算和使用。在这些数据结构中，对象的存储和查找通常遵循以下过程：

- 计算对象的哈希值：
  - 使用`hashCode()`计算对象的哈希值
  - 这个哈希值决定对象应该存储在哪个桶中（通过哈希值计算出来的数组下标确定的数组位置）

- 比较对象的相等性：
  - 如果该桶存在对象，则需要比较两个对象的哈希值，如果两个对象的哈希值相同，此时需要决定它是否能存储在同一个桶中，如果是相同的对象，则不能存放，如果是不同的对象，则可以存放。
  - 此时，使用`equals()`方法来检查对象是否相等。只有到`equals`返回false时，才认为它们是不同的对象，即使它们的哈希值相同。

根据以上的流程，我们就可以推理出为什么重写了`equals`方法后需要重写`hashCode`方法，因为哈希表判断对象是否相同首先是通过`hashCode`方法进行判断的，例如将下面两个对象加入哈希表中，即使两个对象在逻辑上是相同的，但是在内存地址上是不相同的，则计算出来的哈希值是不同的，此时哈希表会判断它们是不同的对象，因为Java中默认的`hashCode`是基于对象的内存地址来进行计算的。

```JAVA
// 逻辑上相等的两个对象，哈希表需要识别出它们是相同的对象。
Person p1 = new Person("Alice", 30);
Person p2 = new Person("Alice", 30);
```

既然重写`equals`方法之后需要重写`hashCode`方法，我们就需要知道其中的注意事项来帮助我们成功地写出合理的`hashCode`函数。

## 	重写 hashCode 注意事项

1. **一致性**：同一对象多次调用`hashCode`方法，必须始终返回相同的值，前提是对象的属性没有被修改。
2. **相等对象的哈希码相等**：如果两个对象根据`equals`方法是相等的，那么它们的`hashCode`方法必须返回相同的值。
3. **不同对象的哈希码尽量不同**：如果两个对象不相等，则它们的`hashCode`方法尽量返回不同的值，以减少哈希冲突。

以下是一个代码示例：

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Person person = (Person) o;

        if (age != person.age) return false;
        return name != null ? name.equals(person.name) : person.name == null;
    }

    @Override
    public int hashCode() {
        return Objects.hash(name,age);
    }
}

```

其中通过调用`Objects`工具类中的`hash`方法来确保当`equals`方法判断出两个对象相同时，`hashCode`方法计算出来的值也必须相同。