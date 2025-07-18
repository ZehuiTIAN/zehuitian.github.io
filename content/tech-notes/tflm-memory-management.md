# TFLM memory management

Tags: Memory, NN, TensorFlow

## Tensor Arena

- `uint8_t* tensor_arena`指针指向一块内存（dtcm或psram）的起点。在Interpreter初始化时交给其成员`allocator`管理。
- 该块内存分为Head、Temporary、Tail三个部分。
    
    ------------------------------------------------------------------------------
    
    |        |                     |                                               |
    
    |  HEAD |<-- TEMPORARY   -->|                  TAIL                         |
    
    |        |                     |                                               |
    
    ------------------------------------------------------------------------------
    
    - Lowest Address Highest Address *
    - **Head** - non-persistent allocations.
    - **Temporary** - short term "scoped" allocations.
    - **Tail** - persistent allocations.
    

## Memory Allocation

- tensor_arena在interpreter初始化时进行处理：align后由`interpreter->allocator`进行管理。
- Interpreter在`init()`和每次`Invoke()`时都会调用`interpreter->**AllocateTensors()**`：在arena区域为所有需要的tensor分配内存。
- **`AllocateTensors():`**
    1. **起始阶段**`MicroAllocator::**StartModelAllocation()**`：
        - 初始化与scratch buffer allocations有关的internal state
        - 分配TfLiteEvalTensor，并设置好其中所有指向flatbuffer的tensor。
        - 分配TfLiteRegistration和TfLiteNode，并设置好所有指向flatbuffer的相关信息。
        
        | **位置（属性）** | **结构类型名称** | **内容** |
        | --- | --- | --- |
        | Tail section（persistent） | TfLiteEvalTensor； | Eval过程中需要用到的，由subgraph中tensor的数量决定。 |
        |  | TfLiteRegistration；
        TfLiteNode； | Model subgraph中用到的所有operator。 |
        
        At the conclusion of this phase, the operator kernel implementations are ready for calls to the *TfLiteRegistration::init()* function. The MicroInterpreter walks through the operator list and invokes all operator implementations that have this function. Typically, operator implementations return the object to store in the user_data field of a TfLiteNode struct.
        
    2. **准备阶段**`TfLiteRegistration::**prepare()**`：
        - 确认容量和模型大小，使用`TfLiteContext::GetScratchBuffer()`分配scratch buffer，计算quantization runtime data（？）
        - 通过`TfLiteTensor`结构来调用tensor数据，该结构包含很多初始化阶段算子需要的信息，仅在此prepare阶段可用，此后只可通过`TfLiteEvalTensor`结构访问。该部分内存分配在head和tail之间的temporary section中，直到`MicroAllocator::ResetTempAllocations()`被调用。
        - 最后`MicroAllocator::FinishPrepareNodeAllocations()`被调用，重置temporary allocation并将所有scratch buffer requests放入head section中。
    3. **结束阶段**`MicroAllocator::**FinishModelAllocation()**`：
        - 在tail中为所有当前在head中的persistent buffer分配内存。
        - 执行Static Memory Plan：
            - 通过`GreedyMemoryPlanner`来优化head中的non-persistent空间
            - 优化需要用到最大byte-width的算子的buffer
            - Allocates pointers in the tail that provide pointers into shared space and offsets in the head.
            - 根据`GreedyMemoryPlanner::GetMaximumMemorySize()`的结果设置head的大小
        - 在tail中分配variable tensor的空间。

## Tips & Issues

1. 在中间移动或者保存tensor_arena时应该整个保存，如果只从头开始保存使用了的bytes会报错（arena_bytes_used），可能是因为temporary部分有未使用的bytes，但只copy arena_bytes_used会使得tail部分copy不完全。
2. Xa_nnlib中fully_connected有对齐操作指针向前移动的操作，可能导致out of bound access，最好在分配时在分配的内存前面预留16bytes（这样修改可能导致free时内存泄漏吗？）。（_xa_nn_dot_product_4_rows_1_vecs_aligned）

## References

[tflite-micro/tensorflow/lite/micro/docs/memory_management.md at main · tensorflow/tflite-micro](https://github.com/tensorflow/tflite-micro/blob/main/tensorflow/lite/micro/docs/memory_management.md#tensor-arena)

[tflite-micro/tensorflow/lite/micro/docs/online_memory_allocation_overview.md at main · tensorflow/tflite-micro](https://github.com/tensorflow/tflite-micro/blob/main/tensorflow/lite/micro/docs/online_memory_allocation_overview.md)

[tflite-micro/tensorflow/lite/micro/docs/offline_memory_plan.md at main · tensorflow/tflite-micro](https://github.com/tensorflow/tflite-micro/blob/main/tensorflow/lite/micro/docs/offline_memory_plan.md)