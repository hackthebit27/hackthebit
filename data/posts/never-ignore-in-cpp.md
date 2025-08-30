---
title: "Things I Should Never Ignore in C++"
date: "2025-08-25"
description: "A practical checklist: RAII, const-correctness, moves, smart pointers, exceptions, and UB traps."
tags: ["c++", "best-practices"]
category: "C++"
---

## 1) Prefer RAII (Resource Acquisition Is Initialization)

Always bind resources to objects so they clean up automatically.

```cpp
#include <fstream>
#include <string>

std::string readWholeFile(const std::string& path) {
    std::ifstream in(path);          // opens in constructor
    if (!in) throw std::runtime_error("open failed");
    std::string data((std::istreambuf_iterator<char>(in)), {});
    return data;                     // file closes automatically (destructor)
}
```

## 2) Use `const` early and often (const-correctness)

Make intent obvious and prevent accidental mutation.

```cpp
void printVec(const std::vector<int>& v) {
    for (const auto& x : v) std::cout << x << " ";
    std::cout << "\n";
}
```

## 3) Prefer smart pointers over `new/delete`

Use `std::unique_ptr` and `std::shared_ptr` instead of raw owning pointers.

```cpp
#include <memory>

struct Node { int value; };

std::unique_ptr<Node> makeNode(int v) {
    return std::make_unique<Node>(Node{v});
}
```

## 4) Understand move semantics (avoid unnecessary copies)

Implement or default the “rule of 5” where needed; prefer moving large objects.

```cpp
#include <vector>

std::vector<int> makeBig() {
    std::vector<int> v(1'000'000, 42);
    return v;                       // NRVO + move
}
```

## 5) Beware of dangling references

Never return references to local variables; never store references to temporaries.

```cpp
const std::string& bad() {
    std::string s = "oops";
    return s;   // ❌ dangling reference
}
```

## 6) Initialize everything

Use brace init; prefer `= default` and member initializers.

```cpp
struct Point {
    int x{0};
    int y{0};
    Point() = default;
};
```

## 7) Exceptions: throw by value, catch by reference

And make your types exception-safe (RAII helps).

```cpp
try {
    risky();
} catch (const std::exception& e) { // ✅
    std::cerr << e.what() << "\n";
}
```

## 8) Undefined Behavior traps to avoid

- Out-of-bounds access
- Use-after-free
- Data races
- Uninitialized reads

Use sanitizers:

```bash
# AddressSanitizer + UndefinedBehaviorSanitizer
clang++ -std=c++20 -fsanitize=address,undefined -g main.cpp -o main
```

## 9) Use standard algorithms & ranges

Prefer expressing *what* you want, not *how* to loop.

```cpp
#include <algorithm>
#include <vector>

int countPos(const std::vector<int>& v) {
    return std::count_if(v.begin(), v.end(), [](int x){ return x > 0; });
}
```

## 10) Avoid macros for logic

Prefer `constexpr`, inline functions, and templates.

```cpp
constexpr int square(int x) { return x * x; }
```

---

### Mini Checklist ✅
- RAII for all resources  
- `const` wherever possible  
- Smart pointers > raw owning pointers  
- Move, don’t copy big things  
- No dangling references  
- Everything initialized  
- Exceptions handled correctly  
- Sanitizers in CI  
- Prefer std algorithms  
- Avoid logic macros

Happy hacking! 🚀
