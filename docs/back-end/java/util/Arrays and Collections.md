在 Java 中，`Arrays` 和 `Collections` 是两个非常重要的工具类，它们分别用于操作数组和集合（如 `List`, `Set`, `Map` 等）。本文将详细介绍这两个工具类的基本用法，并深入分析它们底层排序算法的实现原理，特别是 `Arrays.sort()` 和 `Collections.sort()` 背后的**Dual-Pivot QuickSort** 和 **TimSort**。

## 基础介绍

**`Arrays`** 主要用于处理 **固定大小** 的数组。数组是一种基础的数据结构，适合那些需要快速访问、但大小固定的数据场景。它提供了一系列静态方法，用于排序、搜索、复制、比较等操作。

**`Collections`** 是另一个重要的工具类，专门用于操作 **集合类**，如 `List`, `Set`, `Map` 等。与数组不同，集合类的大小可以**动态改变**，适用于需要更多灵活性的场景。`Collections` 提供了大量的静态方法来增强集合操作的便捷性。

### 1. Arrays 工具类

`Arrays` 是一个用于**操作数组**的工具类，包含了很多静态方法。它主要提供对数组进行排序、搜索、填充、比较等操作。

常见方法：

- **`Arrays.toString()`**: 用于将数组转化为字符串格式。

- **`Arrays.sort()`**：对数组进行排序。默认使用自然顺序（升序），也可以传入比较器进行自定义排序。

- **`Arrays.binarySearch()`**：使用二分查找在排序好的数组中查找元素的索引。如果元素不存在，返回负数。

- **`copyOf(T[] original, int newLength)`**：用于复制数组，创建原数组的一个新副本，并且你可以指定新数组的长度。

> **参数说明**：
>
> - `original`: 需要复制的原数组。
> - `newLength`: 新数组的长度。如果新长度大于原数组，超出的部分将使用默认值（数值类型使用 `0`，引用类型使用 `null`）进行填充。

- **`Arrays.equals()`**：比较两个数组的内容是否相同。
- **`Arrays.fill()`**：用指定的值填充数组中的每个元素。
- **`Arrays.asList()`**：将数组转换为 `List`，但返回的是固定大小的 `List`，无法改变其大小。

### 2. Collections 工具类

`Collections` 是一个操作 `Collection` 对象的工具类，提供了很多静态方法来处理 `List`、`Set` 和 `Map` 等集合。常见的方法包括：

- **`Collections.sort()`**：用于对 `List` 进行排序。可以使用默认的自然顺序，也可以传入 `Comparator` 进行自定义排序。

- **`Collections.reverse()`**：反转 `List` 中的元素顺序。
- **`Collections.synchronizedList()`**：将 `List` 转换为线程安全的集合。
- **`Collections.min()` 和 `Collections.max()`**：查找集合中的最小值和最大值。
- **`Collections.frequency()`**：统计集合中某个元素的出现次数。
- **`Collections.unmodifiableList()`**：返回一个不可修改的集合。如果对返回的集合进行修改操作，会抛出 `UnsupportedOperationException`。

## 源码分析

### 1. Arrays.binarySearch()

以 `long[]` 类型的重载方法为例，`Arrays.binarySearch()` 使用的是 **二分查找算法**，适用于 **已排序** 的数组。该算法通过反复缩小查找范围，极大地减少了查找的次数。

源码实现：

```java
public static int binarySearch(long[] a, long key) {
    return binarySearch0(a, 0, a.length, key);
}
private static int binarySearch0(long[] a, int fromIndex, int toIndex,
                                 long key) {
    int low = fromIndex;
    int high = toIndex - 1;

    while (low <= high) {
        int mid = (low + high) >>> 1;
        long midVal = a[mid];

        if (midVal < key)
            low = mid + 1;
        else if (midVal > key)
            high = mid - 1;
        else
            return mid; // key found
    }
    return -(low + 1);  // key not found.
}
```

算法分析：

- **时间复杂度**：`O(log n)`，因为每次查找都会将数组的搜索范围减半。
- **前提条件**：数组必须是有序的，二分查找才能正常工作。
- **核心思想**：每次比较时，通过分治将问题规模缩小一半，从而快速锁定目标元素。

### 2. Collections.min() 和 Collections.max()

在 `Collections` 工具类中，`min()` 和 `max()` 方法依赖 **线性搜索算法**。它们通过遍历集合中的每个元素，依次比较来确定最小值或最大值。

源码实现：以 `Collections.min()` 为例，源代码的大致结构如下

```java
public static <T extends Object & Comparable<? super T>> T min(Collection<? extends T> coll) {
    Iterator<? extends T> i = coll.iterator();
    T candidate = i.next();  // 假设第一个元素为最小值
    while (i.hasNext()) {
        T next = i.next();
        if (next.compareTo(candidate) < 0) {  // 如果下一个元素比当前最小元素小
            candidate = next;  // 更新最小值
        }
    }
    return candidate;  // 返回最小值
}
```

**时间复杂度**：无论是 `Collections.min()` 还是 `Collections.max()`，都需要对集合中的每一个元素进行一次比较，因此它们的时间复杂度为 **O(n)**。

**补充**：若使用的时候传入了自定义的比较器，则在比较的时候会使用自定义的比较器进行比较。

### 3. sort()

`Arrays.sort()` 和 `Collections.sort()` 是 Java 中常用的排序方法，它们用于对数组和集合进行排序。虽然它们的表面功能相似，但底层实现使用了不同的排序算法，主要是 **Dual-Pivot QuickSort** 和 **TimSort**。下面将详细介绍这两种排序的底层实现原理。

#### 3.1 Arrays.sort() 的底层实现

`Arrays.sort()` 方法用于对 **数组** 进行排序。它根据数组的类型（原生类型或对象类型）使用不同的排序算法。

对于原生数据类型（如 `int[]`、`long[]` 等），JDK 中的 `Arrays.sort()` 使用了一种**混合多策略的排序算法**。它根据数组大小、递归深度、数据分布等特点，动态选择不同的排序策略，以确保在各种场景下实现高效排序。在大多数情况下，`Arrays.sort()` 采用的是 **Dual-Pivot QuickSort**（双轴快速排序）算法。这种算法是由 **Vladimir Yaroslavskiy** 提出的，是对经典快速排序的优化版本。

`Dual-Pivot QuickSort` 使用两个基准来将数组分为 **三部分**，从而进一步优化分区过程，减少递归深度。双轴快速排序的步骤如下：

1. **选择两个基准值**：通常选取数组中的两个元素 `pivot1` 和 `pivot2`，并确保 `pivot1 ≤ pivot2`。Java 实现中，通常选择数组的第一个元素和最后一个元素作为初始基准值，然后根据大小交换它们，确保 `pivot1` 小于等于 `pivot2`。

2. **三路分区**：通过一趟排序将数组分为三个部分：

   - **小于 `pivot1` 的部分**。

   - **介于 `pivot1` 和 `pivot2` 之间的部分**。

   - **大于 `pivot2` 的部分**。

3. **递归排序**：对这三个子数组递归应用双轴快速排序，直到每个子数组的长度为 1 或 0。

以下是关于双轴快速排序的实现：

```java
public static void sort(int[] arr, int left, int right) {
    if (right <= left) {
        return;
    }

    // 选择两个基准值
    int pivot1 = arr[left];
    int pivot2 = arr[right];

    if (pivot1 > pivot2) {
        swap(arr, left, right);
        pivot1 = arr[left];
        pivot2 = arr[right];
    }

    int l = left + 1;  // 左边区域
    int g = right - 1; // 右边区域
    int k = l;

    // 三路分区
    while (k <= g) {
        if (arr[k] < pivot1) {// 将小于 pivot1 的元素放在左边的区域
            swap(arr, k, l);
            l++;
        } else if (arr[k] > pivot2) {// 将大于 pivot2 的元素放在左边的区域
            while (arr[g] > pivot2 && k < g) {
                g--; // 将右边界指针 g 向左移动，找到第一个小于等于 pivot2 的元素
            }
            swap(arr, k, g); // 将大于 pivot2 的元素交换到右侧区域
            g--; // 减少右边界
            if (arr[k] < pivot1) {
                swap(arr, k, l); // 如果交换后的元素比 pivot1 小，将其移动到左边区域
                l++; // 增加左边界
            }
        }// 介于 pivot1 与 pivot2 之间的元素不需要移动
        k++;
    }

    // 将 pivot1 和 pivot2 放到正确位置
    l--;
    g++;
    swap(arr, left, l);
    swap(arr, right, g);

    // 递归排序三部分
    sort(arr, left, l - 1);    // 左边部分
    sort(arr, l + 1, g - 1);   // 中间部分
    sort(arr, g + 1, right);   // 右边部分
}
```

通过双轴分区，Dual-Pivot QuickSort 将原来的二路分区扩展为三路分区，从而降低了递归的深度，提升了整体排序的效率。但该算法是不稳定的排序算法，因为在分区过程中，元素可能会被交换到不同的位置。

而接下来要介绍的是一种稳定的排序算法，是 `Array.sort()` 和 `Collection.sort()` 针对对象数组和对象集合的主要排序算法——**TimSort**。

两个排序算法的对比：

| 对比           | Arrays.sort()（原生数据）   | Arrays.sort()（对象）  | Collections.sort()                   |
| -------------- | --------------------------- | ---------------------- | ------------------------------------ |
| **底层算法**   | Dual-Pivot QuickSort        | TimSort                | TimSort（通过 `Arrays.sort()` 实现） |
| **适用类型**   | 原生数据类型数组            | 对象类型数组           | 集合类（如 `List`）                  |
| **时间复杂度** | 平均 O(n log n)，最坏 O(n²) | O(n log n)             | O(n log n)                           |
| **空间复杂度** | O(log n)                    | O(n)                   | O(n)                                 |
| **稳定性**     | 不稳定                      | 稳定                   | 稳定                                 |
| **适合的场景** | 数值类数组的排序            | 需要稳定排序的对象集合 | 集合类的排序                         |

TimSort 的核心思想是：大多数实际应用中的数据往往是 **部分有序** 的，TimSort 通过识别这些 **已有序列（Runs）** 并利用它们来提高排序效率。它结合了两种排序技术：

- **归并排序**：用于将多个有序的块合并为一个大块。
- **插入排序**：用于在小范围内进行排序，因为插入排序在小数据集上的表现非常好。

TimSort 的执行流程如下：

1. 将数据分割成 **已排序的子序列（Runs）**。
2. 对每个 **Run** 进行排序，通常采用插入排序（对小的序列高效）。
3. 通过归并排序合并这些 **Runs**，最终得到一个完全有序的数组。

以下是关于 TimSort 的基本实现：

```java
public class TimSort {

    // 最小 Run 长度
    private static final int MIN_RUN = 32;

    public static void timSort(int[] arr) {
        int n = arr.length;

        // Step 1: 对每个子数组（Run）使用插入排序
        for (int i = 0; i < n; i += MIN_RUN) {
            insertionSort(arr, i, Math.min((i + MIN_RUN - 1), (n - 1)));
        }

        // Step 2: 合并子数组
        for (int size = MIN_RUN; size < n; size = 2 * size) {
            for (int left = 0; left < n; left += 2 * size) {
                // 找到 mid 和 right 的位置
                int mid = left + size - 1;
                int right = Math.min((left + 2 * size - 1), (n - 1));

                // 合并两个相邻的子数组，若 mid>=right，则没有可供合并的两个数组
                if (mid < right) {
                    merge(arr, left, mid, right);
                }
            }
        }
    }

    // 插入排序，用于排序小范围的数组
    private static void insertionSort(int[] arr, int left, int right) {
        for (int i = left + 1; i <= right; i++) {
            int temp = arr[i];
            int j = i - 1;

            while (j >= left && arr[j] > temp) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = temp;
        }
    }

    // 归并两个子数组：arr[left...mid] 和 arr[mid+1...right]
    private static void merge(int[] arr, int left, int mid, int right) {
        // 找到两个子数组的大小
        int len1 = mid - left + 1, len2 = right - mid;
        int[] leftArr = new int[len1];
        int[] rightArr = new int[len2];

        // 拷贝数据到临时数组
        for (int i = 0; i < len1; i++) {
            leftArr[i] = arr[left + i];
        }
        for (int i = 0; i < len2; i++) {
            rightArr[i] = arr[mid + 1 + i];
        }

        // 合并两个临时数组
        int i = 0, j = 0;
        int k = left;

        while (i < len1 && j < len2) {
            if (leftArr[i] <= rightArr[j]) {
                arr[k] = leftArr[i];
                i++;
            } else {
                arr[k] = rightArr[j];
                j++;
            }
            k++;
        }

        // 拷贝剩余的元素
        while (i < len1) {
            arr[k] = leftArr[i];
            i++;
            k++;
        }
        while (j < len2) {
            arr[k] = rightArr[j];
            j++;
            k++;
        }
    }
}
```

## 总结

本文介绍了 Java 中 `Arrays` 和 `Collections` 工具类的基本用法及其底层实现，尤其是其排序算法的差异。`Dual-Pivot QuickSort` 通过双轴分区提高了效率，而 `TimSort` 则结合了归并排序和插入排序的优点，尤其适合处理部分已排序的数据。如果你对稳定性有要求，`TimSort` 是一个更优的选择；而对于原生数据类型，`Dual-Pivot QuickSort` 是一种性能非常优秀的排序算法。
