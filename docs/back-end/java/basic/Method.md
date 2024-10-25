Java 中的方法是面向对象编程的核心之一，其中比较重要的概念位方法的签名、重载、覆盖以及隐藏。

## 方法签名

方法签名指的是**方法名**和忽略参数名称的**形参列表**（包括参数的类型和数量）共同组成的唯一标识符。你可以把它理解为每个方法的身份证号码，告诉编译器在调用时应该执行哪个具体的方法。

举个例子，下面两个方法虽然参数名称不同，但它们的签名是不同的：

```java
public void exampleMethod(int a) {}
public void exampleMethod(String b) {}
```

虽然它们的名字相同，但由于参数类型不同，因此它们是两个不同的方法。这就是方法签名的作用。

**方法签名的主要作用是唯一标识每个方法**。通过方法签名，编译器可以知道你调用的究竟是哪一个方法，这对理解方法重载（Overloading）至关重要。

## 方法重载（Overloading）

在**同一个类中定义多个名称相同但参数列表不同（包括参数类型和参数数量）的方法**，这种现象被称为方法重载。简单来说，一个类中可以有多个功能相似的方法，它们使用相同的名称，但接受的参数不同。

例如：

```java
public int add(int a, int b) {
    return a + b;
}

public double add(double a, double b) {
    return a + b;
}
```

在这个例子中，我们有两个`add`方法，它们的方法名相同，但参数类型不同，因此构成了方法重载。

那方法重载的重要是什么呢？主要存在以下的两个作用：

- **提高代码的可读性**：通过方法重载，我们可以使用相同的名称来表示类似的功能。这样，代码变得更加简洁直观，有助于读者理解。
- **灵活调用**：根据调用时传递的参数类型和数量，Java编译器会选择合适的方法进行调用，这让代码更具灵活性。

例如：

```java
add(3, 5); // 调用int类型的add方法
add(3.0, 5.0); // 调用double类型的add方法
```

通过重载，程序可以自动选择最合适的方法执行，而不需要手动指定。

## 方法覆盖（Override）

方法覆盖与继承密切相关，是指**子类对从父类继承的方法进行重新实现**。通过覆盖父类的方法，子类可以提供自己特定的实现。这种覆盖是动态的，也就是说，JVM会在运行时根据对象的类型来选择调用哪个方法。

例如：

```java
class Parent {
    void show() {
        System.out.println("Parent show()");
    }
}

class Child extends Parent {
    @Override
    void show() {
        System.out.println("Child show()");
    }
}
```

在上述例子中，子类`Child`通过`@Override`注解覆盖了父类`Parent`的`show()`方法。这样，当调用`show()`方法时，会根据具体对象类型选择是调用父类的实现还是子类的实现。

方法覆盖是多态性的实现，JVM根据对象的实际类型在运行时动态调用相应的方法，这就是**动态绑定**。

```java
Parent obj = new Child();
obj.show(); // 输出 "Child show()"
```

在这个例子中，虽然引用类型是`Parent`，但由于对象的实际类型是`Child`，所以调用了`Child`的`show()`方法。这种行为就是Java中多态性的体现。

那方法的覆盖需要哪些规则？以下是比较重要的几条规则：

- **访问修饰符**：重写后的方法的访问修饰符必须大于或等于父类方法的访问权限。例如，父类方法是`protected`，则子类可以是`protected`或`public`。
- **返回值类型**：对于引用类型，重写后的返回值可以是相同类型或该类型的子类型；对于基本数据类型，返回值必须相同。
- **参数列表**：参数列表必须**完全相同**（类型、数量、顺序）。

## 方法隐藏（Method Hiding）

**方法隐藏**发生在父类定义了一个静态方法，而子类定义了一个具有相同签名（相同方法名和参数列表）的静态方法时。在这种情况下，子类的方法会隐藏父类的方法，而不是对其进行覆盖。

例如：

```java
class Parent {
    static void display() {
        System.out.println("Parent display()");
    }
}

class Child extends Parent {
    static void display() {
        System.out.println("Child display()");
    }
}

public class Test {
    public static void main(String[] args) {
        Parent obj1 = new Parent();
        Parent obj2 = new Child();
        Child obj3 = new Child();

        obj1.display(); // 输出 "Parent display()"
        obj2.display(); // 输出 "Parent display()"，而不是 "Child display()"
        obj3.display(); // 输出 "Child display()"
    }
}
```

有关静态方法存在两个个关键点：

- **静态方法不能被重写**，但可以被**隐藏**。如果子类没有定义与父类相同的静态方法，则可以通过子类访问父类的静态方法。
- **调用决定于引用类型**：静态方法的调用是在**编译时**解析的，因此调用哪个方法取决于引用变量的类型，而不是对象的实际类型。

方法重写涉及实例方法，是在运行时动态绑定的，而方法隐藏涉及静态方法，其调用在编译时就已确定。重写的方法调用基于**对象的实际类型**，而隐藏的方法调用基于**引用变量的类型**。

例如，在上面的代码中：`obj2.display();` 输出 "Parent display()"，因为静态方法的调用依据是引用变量的类型，即`Parent`。

