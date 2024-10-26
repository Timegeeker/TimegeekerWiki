事务（Transaction）是在数据库管理系统中执行的一个操作序列，这些操作要么完全执行，要么完全不执行。事务确保数据的一致性和完整性，是数据库应用程序中非常重要的部分。

> 想象一下你去书店买书。你决定买两本书，交给收银员，然后用银行卡支付。如果支付成功，你就可以拿走书。如果支付失败，收银员会把书拿回来，不会扣除你的钱。这就是一个事务的例子。

事务的四个主要属性 (ACID):

- **原子性（Atomicity）**：事务中的所有操作要么全部完成，要么全部不完成。

- **一致性（Consistency）**：事务执行前后，数据库从一个一致性状态转换到另一个一致性状态。
- **隔离性（Isolation）**：并发事务相互隔离，事务之间不会互相影响。
- **持久性（Durability）**：事务完成后，对数据的修改是永久性的，即使系统发生故障也不会丢失。

## Spring 事务管理的方式

Spring 提供了两种主要的事务管理方式：

- **编程式事务管理**: 通过编写代码显式地控制事务边界。

- **声明式事务管理**: 使用注解或 XML 配置来声明事务边界，无需编写大量的事务控制代码。

假设我们有一个银行账户转账的操作，需要确保从一个账户扣款并向另一个账户入款这两个操作要么都成功，要么都不执行，这时就需要使用事务来保证数据的一致性。

### 1. 编程式事务管理示例

```java
public void transferMoney(Long fromAccountId, Long toAccountId, Double amount) {
    TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

    try {
        // 扣款
        accountRepository.debit(fromAccountId, amount);
        // 入款
        accountRepository.credit(toAccountId, amount);
        // 提交事务
        transactionManager.commit(status);
    } catch (Exception e) {
        // 回滚事务
        transactionManager.rollback(status);
        throw e;
    }
}
```

### 2. 声明式事务管理示例

```java
@Transactional
public void transferMoney(Long fromAccountId, Long toAccountId, Double amount) {
    // 扣款
    accountRepository.debit(fromAccountId, amount);
    // 入款
    accountRepository.credit(toAccountId, amount);
}
```

由于声明式事务比较方便，所以应用的十分广泛，下面主要介绍声明式事务管理（注解形式）。

**声明式事务管理**是通过配置或注解来声明事务边界，而不需要在代码中显式地管理事务。这样可以使代码更加简洁和易于维护。Spring 提供了基于注解和 XML 配置的两种声明式事务管理方式。

Spring 中最常用的声明式事务管理方式是使用 `@Transactional` 注解。你可以在类或方法上使用此注解来声明事务。以下是该注解常见的属性：

| **属性名称**         | **类型**               | **默认值**             | **描述**                                                     |
| -------------------- | ---------------------- | ---------------------- | ------------------------------------------------------------ |
| `propagation`        | `Propagation` 枚举类型 | `Propagation.REQUIRED` | 事务的传播行为，如 `REQUIRED`、`REQUIRES_NEW`、`NESTED` 等。 |
| `isolation`          | `Isolation` 枚举类型   | `Isolation.DEFAULT`    | 事务的隔离级别，如 `READ_COMMITTED`、`REPEATABLE_READ`、`SERIALIZABLE` 等。 |
| `timeout`            | `int`                  | `-1`                   | 事务的超时时间（以秒为单位），`-1` 表示没有超时时间。        |
| `readOnly`           | `boolean`              | `false`                | 是否为只读事务，`true` 表示只读，`false` 表示可读写。        |
| `rollbackFor`        | `Class<?>[]`           | 空                     | 指定哪些异常会触发事务回滚，如 `rollbackFor = Exception.class`。 |
| `noRollbackFor`      | `Class<?>[]`           | 空                     | 指定哪些异常不会触发事务回滚，如 `noRollbackFor = CustomCheckedException.class`。 |
| `transactionManager` | `String`               | 空                     | 指定使用的事务管理器的名称，适用于多事务管理器的情况。       |

## Spring 事务管理

Spring 提供了强大的事务管理功能，可以帮助开发者简化事务处理，提高应用程序的可靠性和数据的一致性。Spring 事务管理的底层依赖于 AOP（面向切面编程）和事务管理器（`PlatformTransactionManager` 接口及其实现类）。当我们使用 `@Transactional` 注解时，Spring AOP 会拦截带有此注解的方法，基于配置的信息启动一个事务，调用方法完成后根据事务状态决定是提交还是回滚。

具体来说，Spring 使用 **代理模式**（基于 JDK 动态代理或 CGLIB 动态代理）来生成代理对象，代理对象会拦截方法调用，从而在方法调用的前后进行事务管理操作。

当你标注 `@Transactional` 注解时，Spring 事务管理器会遵循以下步骤：

1. **创建代理对象**：如果标记 `@Transactional` 注解的方法会被调用，Spring AOP 会创建代理对象来增强这个方法。
2. **事务拦截器**：Spring 提供了 `TransactionInterceptor` 拦截器来拦截代理对象的方法调用。这个拦截器负责事务的开启、提交、回滚以及异常处理。
3. **事务传播机制**：拦截器在进入方法前，会检查事务的传播机制（`Propagation`）来决定是否需要开启新的事务或加入现有事务。
4. **事务提交或回滚**：当目标方法执行完成后，拦截器会根据方法的执行结果和事务属性（如 `rollbackFor` 属性）决定是否提交或回滚事务。

Spring 提供了多个事务管理器，如 `DataSourceTransactionManager`（用于 JDBC 事务管理）、`JpaTransactionManager`（用于 JPA 事务管理）和 `HibernateTransactionManager`（用于 Hibernate 事务管理）。这些事务管理器实现了 `PlatformTransactionManager` 接口，该接口定义了事务的基本操作，如开启、提交和回滚。

## Spring 事务传播机制

事务的传播行为（`Propagation`）决定了一个新方法在调用时是否应该创建一个新的事务，还是加入到现有事务中。Spring 定义了其中传播行为，常用的有以下几种：

- **Propagation.REQUIRED**：如果当前没有事务，则创建一个新事务；如果当前存在事务，则加入这个事务。这是**默认**的传播行为。
- **Propagation.REQUIRES_NEW**：总是新建一个事务，如果当前存在事务，暂停当前事务。

- **Propagation.NESTED**：如果当前存在事务，则创建一个嵌套事务来运行；否则，行为同`REQUIRED`。适用于嵌套事务的场景，例如需要对内部的操作有独立的回滚点。

这些传播行为的选择取决于业务需求。例如，如果你有一个需要独立控制的子操作，那么可以使用`REQUIRES_NEW`，它可以使得子事务独立于父事务的提交或回滚。

我们以几个常见的传播行为来说明在特定情况下事务如何回滚。

### 1. Propagation.REQUIRED（默认传播行为）

如果当前存在一个事务，调用的方法会加入到当前事务；如果没有事务，则会创建一个新的事务。假设我们有两个方法 `methodA` 和 `methodB`，其中 `methodA` 调用了 `methodB`。两个方法的传播行为都设置为 `REQUIRED`，这意味着两个方法在同一个事务上下文中执行。

```java
@Service
public class TransactionService {
    
    @Autowired
    private SomeRepository someRepository;

    @Transactional(propagation = Propagation.REQUIRED)
    public void methodA() {
        // 执行一些数据库操作
        someRepository.doSomething();
        methodB(); // 调用 methodB
    }

    @Transactional(propagation = Propagation.REQUIRED)
    public void methodB() {
        // 执行其他数据库操作
        someRepository.doAnotherThing();
        // 模拟一个异常
        throw new RuntimeException("methodB failed");
    }
}
```

在这个例子中，`methodA` 和 `methodB` 共享同一个事务。当 `methodB` 抛出异常时，整个事务都会回滚，包括 `methodA` 中的所有操作。`Propagation.REQUIRED` 传播行为下，所有参与该事务的方法都被视为同一个事务中的操作，因此，**只要有任何一个方法出现异常，整个事务都会回滚**。

### 2. Propagation.REQUIRES_NEW

无论当前是否存在事务，调用的方法都会创建一个新的事务。如果当前存在事务，则暂停当前事务，直到新事务完成后再恢复。

```java
@Service
public class TransactionService {

    @Autowired
    private SomeRepository someRepository;

    @Transactional(propagation = Propagation.REQUIRED)
    public void methodA() {
        // 执行一些数据库操作
        someRepository.doSomething();
        try {
            methodB(); // 调用 methodB
        } catch (Exception e) {
            // 捕获 methodB 的异常
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void methodB() {
        // 执行其他数据库操作
        someRepository.doAnotherThing();
        // 模拟一个异常
        throw new RuntimeException("methodB failed");
    }
}
```

在这个例子中，`methodA` 使用 `Propagation.REQUIRED`，而 `methodB` 使用 `Propagation.REQUIRES_NEW`。这意味着 `methodB` 会在 `methodA` 的事务上下文之外创建一个新的事务。如果 `methodB` 抛出异常，那么只有 `methodB` 自己的事务会回滚，而 `methodA` 的事务不会受影响。

`Propagation.REQUIRES_NEW` 使得 `methodB` 拥有一个独立的事务，不会因为 `methodA` 的事务状态变化而影响自身的提交或回滚。即使 `methodB` 失败回滚，`methodA` 的操作仍然有效。

### 3. Propagation.NESTED

如果当前存在事务，则方法作为当前事务的嵌套事务执行。嵌套事务的回滚不会影响外部事务，但外部事务的回滚会导致嵌套事务的回滚。嵌套事务支持保存点（savepoint）。

```java
@Service
public class TransactionService {

    @Autowired
    private SomeRepository someRepository;

    @Transactional(propagation = Propagation.REQUIRED)
    public void methodA() {
        // 执行一些数据库操作
        someRepository.doSomething();
        try {
            methodB(); // 调用 methodB
        } catch (Exception e) {
            // 捕获 methodB 的异常
        }
    }

    @Transactional(propagation = Propagation.NESTED)
    public void methodB() {
        // 执行其他数据库操作
        someRepository.doAnotherThing();
        // 模拟一个异常
        throw new RuntimeException("methodB failed");
    }
}
```

在这个例子中，`methodA` 使用 `Propagation.REQUIRED`，而 `methodB` 使用 `Propagation.NESTED`。这种情况下，`methodB` 会在 `methodA` 的事务上下文中创建一个嵌套事务。即使 `methodB` 抛出异常并回滚，`methodA` 也不会立即回滚。但是，如果 `methodA` 发生了异常，则整个事务，包括 `methodB`，都会被回滚。

嵌套事务（`Propagation.NESTED`）使用保存点来管理回滚。子事务的失败不会立即影响外部事务，但外部事务的失败会导致子事务的回滚。

## Spring 事务失效

Spring 的事务管理是一种强大的工具，但如果不注意一些细节，事务可能会失效。以下是一些常见的场景和原因：

### 1. 在同一类内部调用方法（使用 `this` 调用）

在 Spring 中，事务是通过代理来实现的，而代理对象的核心在于它能够在调用方法时进行拦截。如果我们在同一个类中用 `this` 关键字直接调用另一个带有 `@Transactional` 注解的方法，事务会失效。这是因为，使用 `this` 调用方法时，没有经过 Spring AOP 生成的代理对象，所以不会触发事务管理逻辑。

示例代码：

```java
@Service
public class AccountService {
    
    @Autowired
    private AccountRepository accountRepository;

    @Transactional
    public void outerMethod() {
        // 使用 this 调用，不会触发事务管理
        this.innerMethod();
    }

    @Transactional
    public void innerMethod() {
        // 一些数据库操作
    }
}
```

在上面的示例中，`outerMethod` 中使用 `this` 调用了 `innerMethod`，但由于这次调用是直接通过 `this` 访问的，而不是通过代理对象访问的，因此事务不会被触发，`innerMethod` 的 `@Transactional` 将不起作用。

### 2. @Transactional 注解的传播行为不正确

有时候，我们需要在现有事务中加入另一个事务方法，如果此时传播行为设置不当，可能会导致事务失效。例如，`Propagation.NOT_SUPPORTED` 表示不需要支持事务，这种情况下事务将不会生效。此外，如果传播行为设置为 `REQUIRES_NEW` ，会导致创建新的事务，暂停当前事务。

### 3. @Transactional 注解标记在私有方法或 final 方法上

Spring 事务默认是基于代理模式实现的，而 JDK 动态代理只能拦截公共（`public`）方法。如果将 `@Transactional` 标记在私有（`private`） 或最终（`final`）方法上，事务将不会生效。

### 4. 方法执行时抛出的异常未触发事务回滚

默认情况下，Spring 只会到 `RuntimeException` 和 `Error` 进行事务回滚。如果方法抛出了一个受检异常（如 `IOException`），事务默认情况下不会回滚。可以通过 `rollbackFor` 属性进行显式配置。

例如：

```java
@Transactional(rollbackFor = Exception.class)
public void someMethod() throws IOException {
    // 受检异常不会自动触发回滚，需要手动配置
}
```

### 5. 事务超时

如果事务的执行时间超过了设定的超时时间（通过 `timeout` 属性进行设置），Spring 会自动回滚事务。这种情况下，可能会导致事务被回滚而任务事务失效。

### 6. 数据库不支持事务

并非所有的数据库都支持事务。例如，在使用一些内存数据库或不支持事务的表类型（如 MySQL 的 MyISAM 表），即使配置了事务，也不会生效。这并非 Spring 的问题，而是数据库本身的限制。

### 7. 使用多线程导致的事务失效

Spring 事务管理与线程绑定，当某个方法启动了一个新线程后，事务管理将失去对新线程的控制。这是因为事务是和当前线程绑定的，而新启动的线程不再受原有事务的控制。

```java
@Transactional
public void processInTransaction() {
    new Thread(() -> {
        // 此处事务无效，因为是新线程
        doSomeWork();
    }).start();
}
```

### 8. 直接使用非代理对象

如果直接使用非 Spring 容器管理的对象或非代理对象调用方法，则事务同样不会生效。Spring 只能拦截通过其自身管理的 bean 上的调用。

> Spring 事务失效的情况大部分是由于事务通过代理模式来拦截带有 `@Transactional` 注解的方法来实现的，因此如果没有正确通过这条路径正确调用方法则会导致失效的情况。