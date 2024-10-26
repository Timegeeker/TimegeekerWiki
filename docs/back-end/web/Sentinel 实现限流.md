在当今的分布式系统时代，确保系统的稳定性和高可用性是每一位开发者都需要面对的挑战。**流量控制**作为一种有效的手段，被广泛应用于各类系统中。本文将带你从零开始，逐步学习并应用阿里巴巴开源的 **Sentinel**，在 **SpringBoot** 应用中实现对**特定接口的限流**和**参数级别的精细控制**。

## 一、重要概念

1. `Sentinel`：Sentinel 是面向分布式、多语言异构化服务架构的**流量治理组件**，主要以流量为切入点，从流量路由、流量控制、流量整形、熔断降级、系统自适应过载保护、热点流量防护等多个维度来帮助开发者保障微服务的稳定性。（官网）
2. `资源`：资源是 Sentinel 中的关键概念，可以是任何东西，例如服务、方法或者一段代码。Sentinel通过定义资源来保护具体的业务逻辑。在Sentinel中，资源是通过上下文（Context）和资源名称（Resource Name）来标识的。
3. `规则`：规则是针对资源进行流量控制的具体策略，包括**流量控制规则**、**熔断降级规则** 、 **系统保护规则**、**来源访问控制规则**和**热点参数控制规则**。
4. `作用`：通过 Sentinel 对系统中的资源（可以是任何东西，包括方法、一段代码、服务等）进行保护，包括对资源进行请求数量的控制、降级熔断和根据不同的参数值设置不同的控制策略等。

## 二、资源与规则

### 1. 资源的定义

#### 1.1 Sentinel API

1. 用法：采用 `SphU.entry()`定义资源。`SphU.entry` 方法是 Sentinel 的核心入口，用于保护指定资源。它的主要作用是在执行某段代码前，检查该资源是否被允许方法。如果允许，则执行代码；如果不允许，则进行响应的流量控制或熔断处理。

2. 基本用法：

```Java
try (Entry entry = SphU.entry("resourceName")) {
    // 业务代码
} catch (BlockException ex) {
    // 流控处理逻辑
}
```

- **resourceName**：要保护的资源名称，可以是方法名、服务名或自定义的任意标识符。
- **Entry**：代表资源的一个入口点。在 try-with-resources 块中使用时，Entry 会在代码执行完毕后自动退出并释放资源。
- **BlockException**：当资源被流控或熔断时，会抛出这个异常。可以在 catch 块中定义流控或熔断后的处理逻辑，如降级处理或返回默认值。

3. 高级用法：可以通过 `SphU.entry` 方法的重载版本，传递更多参数以进行更细粒度的控制，如指定资源类型、上下文信息、参数等。

```java
try (Entry entry = SphU.entry("doSomethingResource", EntryType.IN, 1, "arg1", "arg2")) {
    // 受保护的业务代码
} catch (BlockException ex) {
    // 流控处理逻辑
}
```

- **EntryType**：资源类型，可以是 `EntryType.IN`（入口流量）或 `EntryType.OUT`（出口流量）。
- **count**：访问的次数，一般设置为 1。
- **args**：传递的参数，用于热点参数限流

> 1. `count` 参数表示当前请求对资源的访问量或权重。例如，如果 `count` 设置为 1，则表示当前请求计为一次访问；如果设置为 5，则表示当前请求计为 5 次访问。
> 2. 通常情况下，如果方法的每次调用都是独立的，可以将 `count` 设置为 1。
> 3. 如果方法的一次调用涉及批量操作，可以根据批量的数量设置 `count`，例如批量处理 10 个请求时，可以将 `count` 设置为 10。

#### 1.2 @SentinelResource 注解

1. 介绍：`@SentinelResource` 注解用于定义受保护的资源，并指定流控和熔断的处理逻辑。该注解可以配置多个参数，例如资源名称、流控降级处理方法等。
2. 基本用法：

```java
import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;

public class MyService {

    @SentinelResource(value = "doSomething", blockHandler = "handleBlock")
    public void doSomething() {
        // 这里是受保护的业务逻辑
        System.out.println("执行受保护的业务逻辑。");
    }

    // 流控降级处理逻辑，参数要与原方法一致，并且最后加上 BlockException
    public void handleBlock(BlockException ex) {
        System.out.println("处理流控制逻辑。");
    }
}
```

3. 注解相关属性：

- **value**：指定资源名称，必须配置。

- **blockHandler**：指定流控降级处理方法的名称，可选。该方法必须和原方法在同一个类中，并且参数类型和返回类型要与原方法一致，最后增加一个 `BlockException` 类型的参数。 当资源被 Sentinel 流控或降级时，会调用这个方法来处理被限制的请求。

- **fallback**：指定当原方法出现异常时的处理方法，可选。参数类型和返回类型要与原方法一致，可以用于处理业务异常。

### 2. 规则的定义

#### 2.1 流量控制规则

1. 流量控制规则：主要用于限制对某个资源（如服务、接口等）的总访问量，通常基于 QPS（每秒查询数）或线程数等指标。

2. 应用范围：流量控制规则应用于所有的请求，不区分请求的具体参数。
3. 重要属性：

| **Field**       | **说明**                                                     | **默认值**                    |
| --------------- | ------------------------------------------------------------ | ----------------------------- |
| resource        | 资源名，资源名是限流规则的作用对象                           |                               |
| count           | 阈值，即限流的最大请求数或并发数。                           |                               |
| grade           | 限流阈值类型，QPS 或线程数模式                               | QPS 模式                      |
| limitApp        | 流控针对的调用来源                                           | `default`，代表不区分调用来源 |
| strategy        | 限流策略，可以是直接限流、关联限流或链路限流。               | 根据资源本身（直接）          |
| controlBehavior | 流控效果（直接拒绝 / 排队等待 / 慢启动模式），不支持按调用关系限流 | 直接拒绝                      |

4. 代码示例：

```java
// 创建流量控制规则
FlowRule rule = new FlowRule();
rule.setResource("doSomething");
rule.setGrade(RuleConstant.FLOW_GRADE_QPS); // 设置限流阙值类型为QPS
rule.setCount(10); // 每秒最多允许 10 次请求
// 加载规则
FlowRuleManager.loadRules(Collections.singletonList(rule));
```

#### 2.2 热点参数规则

1. 热点参数规则：主要用于限制具**有特定参数的**请求的访问量，通常用于防止针对特定参数的恶意刷请求或限制特定用户的访问频率
2. 应用范围：参数控制规则应用于具有特定参数的请求，可以针对不同的参数值（如用户ID、IP地址等）设置不同的控制策略。
3. 重要属性：

| **属性**          | **说明**                                                     | **默认值** |
| ----------------- | ------------------------------------------------------------ | ---------- |
| resource          | 资源名，必填                                                 |            |
| count             | 限流阈值，表示热点参数的限流阈值 ，必填                      |            |
| grade             | 限流的模式，QPS 或并发线程数                                 | QPS 模式   |
| durationInSec     | 统计窗口时间长度（单位为秒），1.6.0 版本开始支持             | 1s         |
| controlBehavior   | 流量控制行为，快速失败、预热、排队等待 ，1.6.0 版本开始支持  | 快速失败   |
| maxQueueingTimeMs | 最大排队等待时长（仅在匀速排队模式生效），1.6.0 版本开始支持 | 0ms        |
| paramIdx          | 热点参数的索引， 表示对第几个参数进行限流 ，必填，对应 `SphU.entry(xxx, args)`中的参数索引位置 |            |
| paramFlowItemList | 参数例外项，可以针对指定的参数值单独设置限流阈值，不受前面 `count`阈值的限制。**仅支持基本类型和字符串类型** |            |
| clusterMode       | 是否是集群参数流控规则                                       | `false`    |
| clusterConfig     | 集群流控相关配置                                             |            |

4. 代码示例：

```java
// 定义资源名称
String resourceName = "myResource";

// 创建参数流控规则
ParamFlowRule rule = new ParamFlowRule(resourceName);
// 设置参数索引，这里假设我们想要控制第一个参数，例如用户ID
rule.setParamIdx(0);
// 设置每秒允许的最大请求次数
rule.setCount(10);

// 将规则添加到Sentinel中
ParamFlowRuleManager.loadRules(new ArrayList<ParamFlowRule>() {{
    add(rule);
}});
```

## 三、实现

背景：通过 Sentinel 来实现 SpringBoot 中某个接口的限流和基于特定参数的限流。例如，对于 UserController 中的 `getUserById` 方法进行流量控制和热点参数控制。

1. 步骤 1：导入依赖

```xml
<dependency>
      <groupId>com.alibaba.csp</groupId>
      <artifactId>sentinel-core</artifactId>
      <version>1.8.6</version>
  </dependency>
  <dependency>
      <groupId>com.alibaba.csp</groupId>
      <artifactId>sentinel-parameter-flow-control</artifactId>
      <version>1.8.6</version>
  </dependency>
```

2. 步骤 2：定义资源——在 Controller 中定义 getUserById 接口，并通过 SphU.entry API 来定义资源

```java
@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private  UserService userService;

    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id){
        try (Entry getUserById = SphU.entry("getUserById", EntryType.IN, 1, id)) {
            User user = userService.getUserById(id);
            return user;
        } catch (BlockException e) {
            // 可以添加被限流的逻辑
            throw new RuntimeException(e);
        }
    }

}
```

3. 步骤 3：定义规则——通过配置类的方式来项目启动时初始化流量控制规则和热点参数规则，将 getUserById 资源设置为每秒只能 200 个请求，将 getUserById 资源设置为每个用户 ID 只能访问 10 次

```java
@Configuration
public class SentinelConfig {

    @PostConstruct
    public void initRules(){
        // 创建流量控制规则，将 getUserById 资源设置为每秒只能有 200 个请求访问
        FlowRule flowRule = new FlowRule();
        flowRule.setResource("getUserById");
        flowRule.setCount(200);
        flowRule.setGrade(RuleConstant.FLOW_GRADE_QPS);
        FlowRuleManager.loadRules(Collections.singletonList(flowRule));

        // 创建热点参数规则，将 getUserById 资源设置为每个用户 ID 只能每秒访问10次
        ParamFlowRule paramFlowRule = new ParamFlowRule();
        paramFlowRule.setResource("getUserById");
        paramFlowRule.setParamIdx(0);
        paramFlowRule.setCount(10);
        ParamFlowRuleManager.loadRules(Arrays.asList(paramFlowRule));
    }

}
```