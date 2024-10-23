

泛型（Generics）是 Java 5 引入的一项重要特性，旨在增强代码的安全性和可读性。泛型机制允许你定义类、接口和方法时使用**类型参数**，这些类型参数在使用时（如实例化类或调用方法时）被具体的类型替换，从而避免在运行时发生类型转换错误，同时减少代码冗余，提供代码的复用性。

泛型可以理解成一种类型参数，也就是在该类、方法或方法中用到的参数的类型是不确定的，交给用户在使用时进行定义，是一种标识。

## 基本概念

泛型的语法结构为：`<类型>`

- `<T>`：T 代表位置的参数类型，称为类型形参
- `<String>`：String 为类型实参

泛型是一种**编译器行为**，在编译阶段泛型才生效，编译之后会被擦除成普通的数据类型，擦除为 Object 或者自限定的类型。以下是擦除机制在 IDEA 中的体现：都被擦除成 List list, 所以出现重载错误。

![](/generics.png)

泛型机制常见的主要作用有：

- 编译器可以在编译时检测类型错误，减少了运行时的类型转换异常。
- 通过泛型，类和方法能够在不改变原有代码的情况下适应更多类型。
- 使用泛型可以避免强制类型转化，例如一个集合使用了泛型，则可以用该泛型类型来操作这些对象，而不必从 Object 强转为对应的类型后进行操作。
- 泛型可以使用自限定类型来提供灵活地类型限定。

## 泛型的定义和使用

泛型主要通过三种方式进行使用：泛型类、泛型接口和泛型方法。

### 1. 泛型类

在类声明时引入类型参数，泛型类的泛型参数可以用在实例变量、方法形参、方法返回值类型上。例如：

```java
public class Box<T> {
    private T content;

    public void setContent(T content) {
        this.content = content;
    }

    public T getContent() {
        return content;
    }
}
```

### 2. 泛型接口

在接口中定义泛型，泛型接口中泛型的使用跟泛型类基本一致。例如：

```java 
public interface Pair<K, V> {
    K getKey();
    V getValue();
}
```

### 3. 泛型方法

在方法中引入类型参数，泛型方法的基本格式如下：

```java
[权限修饰符] <泛型> 返回值类型 方法名（形参列表）{
	// 泛型参数一般可作为形参列表和返回值类型
}
```

需要注意的是，方法中存存在类型参数不代表方法是泛型方法，是否为泛型方法主要是看方法的返回值的左边是否有 `<>` ，以下是一个泛型方法的例子：

```java 
public static <T> T method(T t){

}
```

## 泛型的原理解析

Java 的泛型机制本质上是通过**类型擦除来实现的，这意味着所有泛型类型参数在编译时会被替换为其上限**，如果没有指定上限，就会被替换为 `Object`。这既保证了与非泛型代码的兼容性，又在编译时提供了类型安全性。接下来，我们从几个角度深入剖析泛型的底层实现原理。

### 1. 类型擦除的过程

在代码编译的过程中，Java 编译器会执行以下操作：

- 擦除类型参数：Java 编译器会将泛型类或泛型方法中的所有类型参数替换为具体的类型。通常来说，如果没有指定类型参数的上限，类型参数会被替换为 `Object`。如果有上限，例如 `<T extends Number` ，那么类型参数 `T` 会被替换为 `Number`。
- 插入类型检查和强制类型转换：编译器会在必要的地方插入类型检查和类型转换，以确保类型安全。例如，如果你定义了一个泛型类 `Box<T>` ，在使用 `Box<Integer>` 时，编译器会在从 `Box` 中取出元素时插入类型转换，以确保返回的是 `Integer` 类型。

为了让这一过程更加直观，我们可以通过一个例子来进一步理解。

```java
public class Box<T> {
    private T value;

    public void setValue(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Box<Integer> integerBox = new Box<>();
        integerBox.setValue(10);
        Integer value = integerBox.getValue();
        System.out.println(value);
    }
}
```

在编译过程中，泛型类型`T`在`Box`类中将被替换为`Object`，而`Box<Integer>`的实际操作是通过类型转换来实现的。在编译后，代码的逻辑(编译后的伪代码)基本如下：

```java
public class Box {
    private Object value;

    public void setValue(Object value) {
        this.value = value;
    }

    public Object getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Box integerBox = new Box();
        integerBox.setValue(10);
        Integer value = (Integer) integerBox.getValue();  // 需要进行类型转换
        System.out.println(value);
    }
}
```

可以看出，在编译时，`Box<Integer>` 被擦除为 `Box`，而类型参数 `T` 被擦除为 `Object`。在执行 `integerBox.getValue()` 时，编译器会自动插入类型转换，将`Object`强制转换为`Integer`。

### 2. 类型擦除的影响

由于泛型是在编译时被擦除的，因此**在运行时我们无法获取泛型的实际类型**。这意味着泛型类型在运行时是不可知的。例如，以下代码无法获取泛型的类型信息：

```java
Box<Integer> integerBox = new Box<>();
System.out.println(integerBox.getClass());  // 输出：class Box
```

无论 `Box<Integer>` 还是 `Box<String>` ，在运行时它们都只是 `Box` 类型，因为泛型参数已经被擦除了。

同时，由于泛型擦除的存在，Java 的泛型只支持引用类型，而不支持基本类型（如 `int` 、`double`）。你不能直接创建 `Box<int>` ，必须使用包装类（如 `Box<Integer>` ）。这是因为类型擦除后，泛型会变为 `Object` ，而基本类型不能作为 `Object` 的子类。

并且无法创建泛型类型的数组，例如，`new T[10]` 是非法的。这同样是因为类型擦除机制导致的——在运行时无法确定数组中存放的实际类型，从而无法保证类型安全。

### 3. 桥方法

Java 在使用泛型和继承时，有时需要生产桥方法（Bridge Method）以保证多态的正确性。桥方法是在编译期间由编译器自动生成的，用于解决子类中泛型类型擦除后与父类方法签名不匹配的问题。

```java
class Parent<T> {
    T getValue(T value) {
        return value;
    }
}

class Child extends Parent<String> {
    @Override
    String getValue(String value) {
        return value;
    }
}
```

以上的代码编译后，`Parent<T>` 中的 `getValue` 方法签名变为 `Object getValue(Object)` ，而 `Child` 中的 `getValue` 签名为 `String getValue(String)` 。为了保持父类与子类方法之间的多态性，编译器会为 `Child` 生成一个桥方法：

```java
class Child extends Parent<String> {
    @Override
    String getValue(String value) {
        return value;
    }

    @Override
    Object getValue(Object value) {
        return getValue((String) value);  // 桥方法，负责将Object强制转换为String
    }
}
```

桥方法确保了子类的`getValue(String)`可以正确覆写父类的`getValue(Object)`，从而实现多态。

## 通配符的使用和原理

### 1. 通配符的定义和形式

通配符是 Java 泛型中的一个特殊的符号，标识不确定的类型。通配符主要用于泛型类或泛型方法中，表示可以接受某种范围内的类型。Java 提供了三种形式的通配符：

- **无界通配符（`?`）**：表示任意类型

- **上界通配符（`? extends T`）**：表示 `T` 类型及其子类型。
- **下界通配符（`? super T`）**：表示 `T` 类型及其父类型。

### 2. 三种通配符的区别与使用场景

#### 2.1 无界通配符 `?`

无界通配符表示接受任何类型。常用于表示通用集合的类型，适用于你不关心元素类型的情况。例如：

```java
public void printList(List<?> list) {
    for (Object obj : list) {
        System.out.println(obj);
    }
}
```

在这个例子中，`List<?>` 可以接受任何类型的 `List`，比如 `List<String>` 、`List<Integer>` 等。这在一些通用方法中非常有用。

#### 2.2 上界通配符 `? extends T`

上界通配符表示某种类型 `T` 的子类型。这意味着你可以从泛型类中读取 `T` 及其子类型的对象，但无法向其中添加非 `null` 的元素。常见的使用场景是”只读“操作。例如：

```java
public void processNumbers(List<? extends Number> list){
    for(Number number : list){
        System.out.println(number.doubleValue());
    }
}
```

在这个例子中，`List<? extends Number>` 可以是 `List<Integer>` 、`List<Double>` 等，因为 `Integer` 和 `Double` 都是 `Number` 的子类。但是你不能向 `list` 中添加任何元素（除了 `null`），因为编译器无法确定它具体的子类型。

#### 2.3 下界通配符 `? super T `

下界通配符表示某种类型 `T` 的父类型。这意味着你可以向泛型类中添加 `T` 及其父类型的对象，但从中读取的数据只能保证是 `Object` 类型。常见的使用场景是”写入“操作。例如：

```java
public void addIntegers(List<? super Integer list){
    list.add(10);
    list.add(20);
}
```

在这个例子中，`List<? super Integer>` 可以是 `List<Object>` 、`List<Number>` 或 `List<Integer>` ，因为 `Object` 和 `Number` 都是 `Integer` 的父类型。你可以向 `list` 中添加 `Integer` 类型的对象。

### 3. 协变和逆变的概念

协变（Covariance）和逆变（Contravariance）是泛型中重要的概念。协变允许一个泛型类接受它的子类，逆变允许一个泛型类接受它的父类。Java 通过通配符来实现这些概念：

- **协变（`? extends T`）**：表示可以使用 `T` 的子类型，例如 `List<? extends Number` 可以接受`List<Integer>`、`List<Double>`。

- **逆变（`? super T`）**：表示可以使用 `T` 的父类型，例如`List<? super Integer>`可以接受`List<Number>`、`List<Object>`。

### 4. PECS 原则

PECS 原则是 Java 泛型涉及中一个重要的指导原则，PECS 代表 **Producer Extends，Consumer Super**，意思是：

- **Producer 使用 `extends`** ：如果一个集合只生产（读取）元素，使用 `? extends T`。
- **Consumer 使用 `super`** ：如果一个集合只消费（写入）元素，使用 `? super T`。

假设我们有一个方法，它的目的是从集合中读取元素而不需要修改集合内容。在这种情况下，使用 `? extends T` 是最佳选择，因为它能够保证所有读取的元素至少是 `T` 类型的。

```java 
public void readNumbers(List<? extends Number> list) {
    for (Number number : list) {
        System.out.println(number);
    }
}
```

假设我们有一个方法，它的目的是向集合中写入 `T` 类型的元素。在这种情况下，使用 `? super T` 是最佳选择，因为它能够保证所有写入的元素都是 `T` 类型的，且集合的类型是 `T` 的父类型。

```java
public void addNumbers(List<? super Integer> list) {
    list.add(10);
    list.add(20);
}
```

换句话说，如果你需要从集合中获取元素，而不向集合中添加元素，那么你应该使用 `? extends T` ；如果你需要向集合中添加元素，而不从集合中获取元素，那么你应该使用 `? super T` 。

