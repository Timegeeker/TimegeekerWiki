**Swagger** ：Swagger 是一个开源的 API 文档生成工具，它可以根据 API 的定义生成交互式的 API 文档，使开发者可以快速了解 API 的使用方法和参数。Swagger 的**主要特点**包括：

- **自动生成 API 文档**：Swagger 可以根据 API 的定义生成交互式的 API 文档，无需手动编写文档。

- **支持多种编程语言**：Swagger支持多种编程语言，包括 Java、Python、Node.js 等。

- **交互式文档**：Swagger 生成的文档可以交互式地尝试 API，查看请求和响应数据。

- **支持 OAuth 和其他认证机制**：Swagger 支持 OAuth 和其他认证机制，用于保护 API 的安全。

**Knife4j**：Knife4j是Swagger的一个增强版本，专为Java MVC框架设计，用于生成API文档。它提供了比原生Swagger UI更多的功能和更好的用户体验。Knife4j 的**主要特点**包括：

- **界面美化**： Knife4j对Swagger默认生成的文档界面进行了美化，提供了更加现代化和易于使用的UI，使得API文档更具可读性和用户友好性。
- **多API分组支持**： Knife4j允许将API分组，便于管理和查看不同模块或版本的API文档。
- **增强的接口调试功能**： 提供了在线测试接口的功能，开发者可以直接在文档页面中输入参数并发送请求，查看响应结果，方便调试和验证API。

## SpringBoot 集成 Knife4j

> 版本信息：**SpringBoot3 + Knife4j 4**
>
> 注意事项：Spring Boot 3 只支持**OpenAPI3**规范

1. 步骤1：依赖导入

```xml
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
    <version>4.4.0</version>
</dependency>
```

2. 步骤2：配置文件进行相关配置

```yaml
# springdoc-openapi项目配置
springdoc:
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
  api-docs:
    path: /v3/api-docs
  group-configs:
    - group: 'default'
      paths-to-match: '/**'
      packages-to-scan: com.knife4j.demo
# knife4j的增强配置，不需要增强可以不配
knife4j:
  enable: true
  setting:
    language: zh_cn
```

3. 步骤3：基于OpenAPI3的规范注解，在项目的RSET接口中添加相应的注解。

- Controller 接口定义：

```java
package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api")
@Tag(name = "示例API", description = "用于演示Swagger注解的示例API")
public class ExampleController {

    @Operation(summary = "简单的POST请求，带请求体")
    @PostMapping("/simple")
    public ResponseEntity<SimpleResponse> simplePost(@RequestBody SimpleResponse request) {
        return ResponseEntity.ok(request);
    }

    @Operation(summary = "带请求体、路径参数、请求头参数和查询参数的POST请求")
    @Parameters({
        @Parameter(name = "id", description = "项目的ID", in = ParameterIn.PATH),
        @Parameter(name = "Authorization", description = "授权令牌", required = true, in = ParameterIn.HEADER),
        @Parameter(name = "name", description = "项目名称", required = true, in = ParameterIn.QUERY)
    })
    @PostMapping("/complex/{id}")
    public ResponseEntity<SimpleResponse> complexPost(
            @PathVariable("id") String id,
            @RequestHeader("Authorization") String authorization,
            @RequestParam("name") String name,
            @RequestBody SimpleResponse request) {

        request.setName(request.getName() + ", 名称: " + name + ", 令牌: " + authorization + ", ID: " + id);
        return ResponseEntity.ok(request);
    }
}
```

- 实体类定义：

```java
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "简单响应对象")
public class SimpleResponse {

    @Schema(description = "名称", example = "示例名称")
    private String name;

    @Schema(description = "消息", example = "这是一个示例消息")
    private String message;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
```

4. 步骤4：启动 `SpringBoot` 项目后，访问Knife4j的文档地址-`http://ip:port/doc.html`

![](/knife4j-1.png)

> 生成 API 在线文档网页之后，就可以通过该文档进行接口调试。

5. 步骤5：调试接口

![](/knife4j-2.png)

## 常见 Swagger 注解

1. `@Tag`: 用于给API分组并提供描述。
2. `@Operation`: 描述操作概要。
3. `@Parameters`: 定义多个Swagger参数注解。
4. `@Parameter` ：用于描述API操作方法中的单个参数。
5. `@Schema`：
   - 类级别：用于描述整个类的用途和意义。
   - 字段级别：用于描述字段的用途，同时可以提供一个示例值。