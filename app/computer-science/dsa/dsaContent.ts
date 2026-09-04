import type { Metadata } from "next";

export type DsaContent = {
  slug: string;
  route: string;
  name: string;
  category: "Data Structure" | "Sorting Algorithm" | "Graph Algorithm";
  badge: string;
  pageTitle: string;
  metaDescription: string;
  heroDescription: string;
  definition: string;
  behavior: string;
  complexity: string;
  visualSteps: string[];
  learningObjectives: string[];
  useCases: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export const dsaContent: Record<string, DsaContent> = {
  "graph-algorithms": {
    slug: "graph-algorithms",
    route: "graph-algorithms",
    name: "Graph Algorithms & Network Flow",
    category: "Graph Algorithm",
    badge: "Node-Edge Network & Pathfinding Engine",
    pageTitle: "Graph Algorithms & Network Flow Visualizer - Interactive DSA Lab | OpenLabs",
    metaDescription:
      "Learn graph algorithms with an interactive DSA visualizer. Practice Dijkstra's shortest path, BFS, Bellman-Ford, Kruskal & Prim MST, chromatic vertex coloring, and Ford-Fulkerson max network flow.",
    heroDescription:
      "Construct custom weighted networks, trace Dijkstra shortest paths, compute Kruskal Minimum Spanning Trees, test 2-colorability, and simulate Ford-Fulkerson maximum network flow step by step.",
    definition:
      "A graph G = (V, E) is a non-linear data structure consisting of vertices (nodes) connected by edges, used to model networks, routing paths, and relationships.",
    behavior:
      "Graph algorithms traverse or optimize network topologies using greedy relaxations (Dijkstra), disjoint set cycle checks (Kruskal), level-order exploration (BFS), or augmenting residual paths (Ford-Fulkerson).",
    complexity: "Dijkstra: O((V + E) log V), Kruskal: O(E log E), BFS: O(V + E), Max Flow: O(V E²)",
    visualSteps: ["Build Graph", "Trace Shortest Path", "Compute Spanning Tree", "Color Vertices", "Augment Network Flow"],
    learningObjectives: [
      "Construct and manipulate directed and undirected weighted graphs.",
      "Trace Dijkstra, BFS, and Bellman-Ford shortest path algorithms with live distance tables.",
      "Compare Kruskal's (DSU) and Prim's cut-property Minimum Spanning Tree algorithms.",
      "Solve chromatic vertex coloring and evaluate bipartite graph 2-colorability.",
      "Simulate Ford-Fulkerson / Edmonds-Karp maximum network flow along residual capacity paths.",
    ],
    useCases: [
      "GPS navigation and shortest route planning",
      "Network packet routing and telecom infrastructure",
      "Social networks and dependency graphs",
      "Compiler register allocation and job scheduling",
      "Maximum bipartite matching and pipeline flow optimization",
    ],
    faqs: [
      {
        question: "How does Dijkstra's algorithm work?",
        answer:
          "Dijkstra uses a priority queue to greedily visit the unvisited node with the smallest tentative distance, updating/relaxing neighbor distances until the target is reached.",
      },
      {
        question: "What is the difference between Kruskal and Prim for MST?",
        answer:
          "Kruskal sorts all edges globally and uses Union-Find (DSU) to avoid cycles. Prim starts from a seed vertex and greedily grows a single cut-property tree outward.",
      },
      {
        question: "What is the Ford-Fulkerson method?",
        answer:
          "It computes maximum network flow by iteratively finding augmenting paths in a residual capacity graph using BFS (Edmonds-Karp) until no more capacity paths exist.",
      },
    ],
  },
  "linked-list": {
    slug: "linked-list",
    route: "linked-list",
    name: "Linked List",
    category: "Data Structure",
    badge: "Pointer-based data structure",
    pageTitle: "Linked List Visualizer - Interactive DSA Lab | OpenLabs",
    metaDescription:
      "Learn linked lists with an interactive DSA visualizer. Practice nodes, pointers, insertion, deletion, traversal, and memory-style data structure behavior.",
    heroDescription:
      "Explore linked lists by watching nodes connect through pointers while insertion, deletion, and traversal operations update the structure.",
    definition:
      "A linked list is a linear data structure made of nodes, where each node stores data and a reference to the next node.",
    behavior:
      "Unlike arrays, linked lists do not require contiguous memory. Each operation depends on how nodes are connected and how pointers are updated.",
    complexity: "Search: O(n), Insert at head: O(1), Delete with node reference: O(1)",
    visualSteps: ["Create node", "Link pointer", "Update head", "Traverse nodes"],
    learningObjectives: [
      "Understand nodes, links, head pointers, and traversal.",
      "Visualize insertion and deletion without relying on array indexing.",
      "Compare linked lists with arrays for memory and access behavior.",
      "Practice pointer updates used in many DSA interview problems.",
    ],
    useCases: [
      "Dynamic memory structures",
      "Stacks and queues",
      "Adjacency lists in graphs",
      "Undo and history systems",
    ],
    faqs: [
      {
        question: "What is a linked list?",
        answer:
          "A linked list is a chain of nodes where each node stores data and a pointer to the next node.",
      },
      {
        question: "Why use a linked list instead of an array?",
        answer:
          "Linked lists are useful when frequent insertion and deletion are needed without shifting many elements.",
      },
      {
        question: "Is linked list traversal fast?",
        answer:
          "Traversal is O(n) because nodes must be visited one by one from the head.",
      },
    ],
  },
  queue: {
    slug: "queue",
    route: "queue",
    name: "Queue",
    category: "Data Structure",
    badge: "FIFO data structure",
    pageTitle: "Queue Visualizer - FIFO Data Structure Lab | OpenLabs",
    metaDescription:
      "Learn queues with an interactive DSA visualizer. Practice enqueue, dequeue, front, rear, FIFO order, and real-world queue applications.",
    heroDescription:
      "Understand queue behavior by adding items at the rear and removing them from the front in first-in, first-out order.",
    definition:
      "A queue is a linear data structure where the first inserted item is the first one removed.",
    behavior:
      "Queue operations follow FIFO order: enqueue adds to the rear, dequeue removes from the front, and peek reads the front item.",
    complexity: "Enqueue: O(1), Dequeue: O(1), Peek: O(1)",
    visualSteps: ["Enqueue item", "Move rear", "Dequeue front", "Maintain FIFO"],
    learningObjectives: [
      "Understand FIFO order and queue operation flow.",
      "Practice enqueue, dequeue, front, and rear behavior.",
      "Connect queues with scheduling and buffering problems.",
      "Visualize how items move through a linear queue.",
    ],
    useCases: [
      "CPU and process scheduling",
      "Printer queues",
      "Breadth-first search",
      "Message buffering",
    ],
    faqs: [
      {
        question: "What is a queue in DSA?",
        answer:
          "A queue is a FIFO data structure where the first inserted element is removed first.",
      },
      {
        question: "What are enqueue and dequeue?",
        answer:
          "Enqueue adds an element to the rear, while dequeue removes an element from the front.",
      },
      {
        question: "Where are queues used?",
        answer:
          "Queues are used in scheduling, buffering, BFS traversal, and request processing.",
      },
    ],
  },
  stack: {
    slug: "stack",
    route: "stack",
    name: "Stack",
    category: "Data Structure",
    badge: "LIFO data structure",
    pageTitle: "Stack Visualizer - LIFO Data Structure Lab | OpenLabs",
    metaDescription:
      "Learn stacks with an interactive DSA visualizer. Practice push, pop, peek, LIFO order, recursion, expression evaluation, and stack applications.",
    heroDescription:
      "Explore stack operations by pushing values on top, popping the latest value, and seeing last-in, first-out behavior clearly.",
    definition:
      "A stack is a linear data structure where the last inserted item is the first one removed.",
    behavior:
      "Stack operations happen at one end called the top. Push adds to the top, pop removes from the top, and peek reads the top item.",
    complexity: "Push: O(1), Pop: O(1), Peek: O(1)",
    visualSteps: ["Push value", "Update top", "Peek top", "Pop latest"],
    learningObjectives: [
      "Understand LIFO behavior and top pointer movement.",
      "Practice push, pop, peek, overflow, and underflow ideas.",
      "Connect stacks with recursion and function calls.",
      "Visualize stack state after every operation.",
    ],
    useCases: [
      "Function call stack",
      "Undo and redo actions",
      "Expression evaluation",
      "Backtracking algorithms",
    ],
    faqs: [
      {
        question: "What is a stack in DSA?",
        answer:
          "A stack is a LIFO data structure where the last inserted element is removed first.",
      },
      {
        question: "What are push and pop?",
        answer:
          "Push inserts an element on top of the stack, while pop removes the top element.",
      },
      {
        question: "Where are stacks used?",
        answer:
          "Stacks are used in recursion, undo systems, expression parsing, browser history, and backtracking.",
      },
    ],
  },
  "bubble-sort": {
    slug: "bubble-sort",
    route: "sorting/bubble-sort",
    name: "Bubble Sort",
    category: "Sorting Algorithm",
    badge: "Comparison sorting",
    pageTitle: "Bubble Sort Visualizer - Interactive Sorting Lab | OpenLabs",
    metaDescription:
      "Learn bubble sort with an interactive sorting visualizer. Watch comparisons, swaps, passes, sorted region growth, and O(n^2) behavior.",
    heroDescription:
      "Watch bubble sort compare neighboring values, swap them when needed, and move larger values toward the end of the array.",
    definition:
      "Bubble sort is a simple comparison sorting algorithm that repeatedly swaps adjacent elements when they are in the wrong order.",
    behavior:
      "Each pass pushes the largest remaining value toward its final position, forming a sorted region at the end of the array.",
    complexity: "Best: O(n), Average: O(n^2), Worst: O(n^2), Space: O(1)",
    visualSteps: ["Compare neighbors", "Swap if needed", "Finish pass", "Grow sorted region"],
    learningObjectives: [
      "Understand adjacent comparisons and swaps.",
      "Visualize why repeated passes are needed.",
      "Learn best, average, and worst-case time complexity.",
      "Compare bubble sort with faster sorting algorithms.",
    ],
    useCases: [
      "Teaching sorting basics",
      "Small datasets",
      "Algorithm tracing practice",
      "Introductory DSA labs",
    ],
    faqs: [
      {
        question: "What is bubble sort?",
        answer:
          "Bubble sort repeatedly compares adjacent elements and swaps them until the array is sorted.",
      },
      {
        question: "What is bubble sort time complexity?",
        answer:
          "Bubble sort is O(n^2) on average and worst case, with O(n) best case when optimized for an already sorted array.",
      },
      {
        question: "Is bubble sort good for large datasets?",
        answer:
          "No. Bubble sort is mainly used for learning because it is simple but inefficient for large datasets.",
      },
    ],
  },
  "heap-sort": {
    slug: "heap-sort",
    route: "sorting/heap-sort",
    name: "Heap Sort",
    category: "Sorting Algorithm",
    badge: "Heap-based sorting",
    pageTitle: "Heap Sort Visualizer - Interactive Heap Algorithm Lab | OpenLabs",
    metaDescription:
      "Learn heap sort with an interactive visualizer. Watch heap construction, max heap behavior, extraction, heapify steps, and O(n log n) sorting.",
    heroDescription:
      "Explore heap sort by building a max heap, moving the root to the sorted region, and heapifying the remaining array.",
    definition:
      "Heap sort is a comparison sorting algorithm that uses a binary heap to repeatedly select the largest or smallest element.",
    behavior:
      "The algorithm builds a heap, swaps the root with the last unsorted item, shrinks the heap, and restores the heap property.",
    complexity: "Best: O(n log n), Average: O(n log n), Worst: O(n log n), Space: O(1)",
    visualSteps: ["Build max heap", "Swap root", "Shrink heap", "Heapify"],
    learningObjectives: [
      "Understand heap structure and heap property.",
      "Visualize heapify after extraction.",
      "Learn why heap sort gives O(n log n) worst-case time.",
      "Connect array representation with binary heap behavior.",
    ],
    useCases: [
      "Priority queue concepts",
      "In-place sorting",
      "Systems with memory limits",
      "Algorithm complexity practice",
    ],
    faqs: [
      {
        question: "What is heap sort?",
        answer:
          "Heap sort is a sorting algorithm that uses a heap to repeatedly place the largest element into its final position.",
      },
      {
        question: "What is heap sort time complexity?",
        answer:
          "Heap sort runs in O(n log n) time in best, average, and worst cases.",
      },
      {
        question: "Is heap sort stable?",
        answer:
          "Heap sort is generally not stable because equal elements can change relative order during heap operations.",
      },
    ],
  },
  "insertion-sort": {
    slug: "insertion-sort",
    route: "sorting/insertion-sort",
    name: "Insertion Sort",
    category: "Sorting Algorithm",
    badge: "Incremental sorting",
    pageTitle: "Insertion Sort Visualizer - Interactive Sorting Lab | OpenLabs",
    metaDescription:
      "Learn insertion sort with an interactive visualizer. Watch key selection, shifting, insertion position, sorted prefix growth, and complexity.",
    heroDescription:
      "Watch insertion sort build a sorted prefix by picking one key at a time and inserting it into the correct position.",
    definition:
      "Insertion sort is a comparison sorting algorithm that builds the final sorted array one item at a time.",
    behavior:
      "It treats the left side as sorted, selects the next key, shifts larger values right, and inserts the key in place.",
    complexity: "Best: O(n), Average: O(n^2), Worst: O(n^2), Space: O(1)",
    visualSteps: ["Select key", "Compare left", "Shift values", "Insert key"],
    learningObjectives: [
      "Understand sorted prefix growth.",
      "Visualize shifting instead of swapping every pair.",
      "Learn why insertion sort is efficient on nearly sorted data.",
      "Practice tracing key movement through an array.",
    ],
    useCases: [
      "Small arrays",
      "Nearly sorted data",
      "Hybrid sorting algorithms",
      "Teaching stable sorting",
    ],
    faqs: [
      {
        question: "What is insertion sort?",
        answer:
          "Insertion sort builds a sorted section by inserting each new element into its correct position.",
      },
      {
        question: "When is insertion sort efficient?",
        answer:
          "Insertion sort is efficient for small or nearly sorted arrays because it can run close to O(n).",
      },
      {
        question: "Is insertion sort stable?",
        answer:
          "Yes. Standard insertion sort is stable because equal elements keep their relative order.",
      },
    ],
  },
  "merge-sort": {
    slug: "merge-sort",
    route: "sorting/merge-sort",
    name: "Merge Sort",
    category: "Sorting Algorithm",
    badge: "Divide and conquer",
    pageTitle: "Merge Sort Visualizer & Visualization - Divide and Conquer Sorting Lab | OpenLabs",
    metaDescription:
      "Free merge sort visualizer and step-by-step visualization. Watch divide and conquer recursion, merging, sorted subarrays, and O(n log n) behavior live.",
    heroDescription:
      "Explore merge sort by splitting arrays into smaller parts, sorting them recursively, and merging sorted subarrays back together.",
    definition:
      "Merge sort is a divide-and-conquer sorting algorithm that recursively splits the array and merges sorted halves.",
    behavior:
      "It divides the array until small pieces remain, then merges those pieces in sorted order to build the final sorted array.",
    complexity: "Best: O(n log n), Average: O(n log n), Worst: O(n log n), Space: O(n)",
    visualSteps: ["Split array", "Sort halves", "Compare fronts", "Merge results"],
    learningObjectives: [
      "Understand divide and conquer recursion.",
      "Visualize how sorted subarrays are merged.",
      "Learn why merge sort has reliable O(n log n) time.",
      "Compare stable sorting with in-place sorting tradeoffs.",
    ],
    useCases: [
      "Stable sorting",
      "Linked list sorting",
      "External sorting",
      "Large predictable workloads",
    ],
    faqs: [
      {
        question: "What is merge sort?",
        answer:
          "Merge sort splits data into smaller parts, sorts those parts, and merges them into a sorted result.",
      },
      {
        question: "What is merge sort time complexity?",
        answer:
          "Merge sort runs in O(n log n) time in best, average, and worst cases.",
      },
      {
        question: "Is merge sort stable?",
        answer:
          "Yes. Merge sort is stable when equal elements are merged in their original relative order.",
      },
    ],
  },
  "quick-sort": {
    slug: "quick-sort",
    route: "sorting/quick-sort",
    name: "Quick Sort",
    category: "Sorting Algorithm",
    badge: "Partition-based sorting",
    pageTitle: "Quick Sort Visualizer - Partition Sorting Lab | OpenLabs",
    metaDescription:
      "Learn quick sort with an interactive visualizer. Watch pivot selection, partitioning, recursive subarrays, swaps, and sorting complexity.",
    heroDescription:
      "Watch quick sort choose a pivot, partition smaller and larger values, and recursively sort each side.",
    definition:
      "Quick sort is a divide-and-conquer sorting algorithm that partitions an array around a pivot.",
    behavior:
      "After partitioning, values smaller than the pivot move to one side and larger values move to the other, then recursion sorts both sides.",
    complexity: "Best: O(n log n), Average: O(n log n), Worst: O(n^2), Space: O(log n)",
    visualSteps: ["Choose pivot", "Partition array", "Recurse left", "Recurse right"],
    learningObjectives: [
      "Understand pivot selection and partitioning.",
      "Visualize recursive sorting of subarrays.",
      "Learn why pivot quality affects performance.",
      "Compare quick sort with merge sort and heap sort.",
    ],
    useCases: [
      "Fast average-case sorting",
      "In-place array sorting",
      "Interview algorithm practice",
      "Divide-and-conquer learning",
    ],
    faqs: [
      {
        question: "What is quick sort?",
        answer:
          "Quick sort partitions an array around a pivot and recursively sorts the partitions.",
      },
      {
        question: "What is quick sort time complexity?",
        answer:
          "Quick sort is O(n log n) on average but can become O(n^2) with poor pivot choices.",
      },
      {
        question: "Is quick sort in-place?",
        answer:
          "Most implementations are in-place apart from recursion stack space.",
      },
    ],
  },
  "selection-sort": {
    slug: "selection-sort",
    route: "sorting/selection-sort",
    name: "Selection Sort",
    category: "Sorting Algorithm",
    badge: "Minimum selection sorting",
    pageTitle: "Selection Sort Visualizer - Interactive Sorting Lab | OpenLabs",
    metaDescription:
      "Learn selection sort with an interactive visualizer. Watch minimum selection, swaps, sorted region growth, comparisons, and O(n^2) behavior.",
    heroDescription:
      "Watch selection sort scan the unsorted region, find the minimum value, and place it into the next sorted position.",
    definition:
      "Selection sort is a comparison sorting algorithm that repeatedly selects the smallest remaining element and moves it into place.",
    behavior:
      "Each pass finds the minimum value in the unsorted region and swaps it with the first unsorted element.",
    complexity: "Best: O(n^2), Average: O(n^2), Worst: O(n^2), Space: O(1)",
    visualSteps: ["Scan minimum", "Select value", "Swap into place", "Grow sorted region"],
    learningObjectives: [
      "Understand minimum selection from the unsorted region.",
      "Visualize comparisons and swaps for each pass.",
      "Learn why selection sort always performs many comparisons.",
      "Compare selection sort with bubble and insertion sort.",
    ],
    useCases: [
      "Introductory sorting lessons",
      "Small arrays",
      "Low swap-count scenarios",
      "Algorithm tracing practice",
    ],
    faqs: [
      {
        question: "What is selection sort?",
        answer:
          "Selection sort repeatedly finds the smallest element in the unsorted part and swaps it into the sorted part.",
      },
      {
        question: "What is selection sort time complexity?",
        answer:
          "Selection sort is O(n^2) in best, average, and worst cases.",
      },
      {
        question: "Does selection sort make many swaps?",
        answer:
          "No. Selection sort makes at most one swap per pass, but it still makes many comparisons.",
      },
    ],
  },

  "pathfinding-astar": {
    slug: "pathfinding-astar",
    route: "pathfinding-astar",
    name: "A* Pathfinding & Heuristic Search",
    category: "Graph Algorithm",
    badge: "Informed Search & Heuristic Routing Engine",
    pageTitle: "A* Pathfinding Visualizer - Interactive Grid Search & Heuristics | OpenLabs",
    metaDescription:
      "Master A* Pathfinding and graph search algorithms with an interactive visualizer. Compare A*, Dijkstra, Greedy Best-First, BFS, and DFS on custom weighted grids with obstacle painting and procedural mazes.",
    heroDescription:
      "Paint custom walls and weighted terrain (mud, water), drag start and target pins, test Manhattan/Euclidean heuristics, and benchmark A* search efficiency against Dijkstra in real time.",
    definition:
      "A* Search is an informed graph traversal algorithm that evaluates nodes using f(n) = g(n) + h(n), where g(n) is the exact path cost from the start node and h(n) is an admissible heuristic estimate to the goal.",
    behavior:
      "A* maintains an open set priority queue ordered by f(n). By factoring in both historical travel cost and heuristic distance, it directs exploration toward the goal while guaranteeing the shortest path when h(n) is admissible.",
    complexity: "Time: O((V + E) log V) with priority queue, Space: O(V) storing open and closed sets",
    visualSteps: ["Place Start & Target", "Paint Obstacles & Weighted Terrain", "Select Heuristic", "Visualize Open/Closed Sets", "Trace Optimal Path"],
    learningObjectives: [
      "Understand the governing formula f(n) = g(n) + h(n) and the role of heuristic functions.",
      "Evaluate admissible heuristics: Manhattan (4-directional), Euclidean (straight-line), and Octile (diagonal).",
      "Observe how weighted terrain (mud, swamp) alters path routing compared to uniform grids.",
      "Analyze the difference between Dijkstra (h=0) and Greedy Best-First (f=h) in concave dead-end traps.",
      "Benchmark search efficiency: measure nodes visited, path cost, and compute duration in real time.",
    ],
    useCases: [
      "Video game NPC navigation and tactical pathfinding",
      "Autonomous vehicle and robotics motion planning",
      "Logistics delivery routing and supply chain navigation",
      "Network routing with quality-of-service (QoS) path metrics",
      "Procedural puzzle and maze solving in computer vision",
    ],
    faqs: [
      {
        question: "What makes A* different from Dijkstra's algorithm?",
        answer:
          "Dijkstra's algorithm expands uniformly in all directions (h = 0). A* uses a heuristic h(n) to focus exploration toward the target, typically visiting 60% to 80% fewer nodes while still guaranteeing an optimal path.",
      },
      {
        question: "What is an admissible heuristic?",
        answer:
          "A heuristic h(n) is admissible if it never overestimates the actual cost to reach the goal. If h(n) is admissible and consistent, A* is mathematically guaranteed to return the optimal (shortest) path.",
      },
      {
        question: "Why does Greedy Best-First Search get stuck in dead ends?",
        answer:
          "Greedy Best-First only considers h(n) (distance to target) and ignores g(n) (cost traveled). When facing a concave wall (U-shape), it rushes inside toward the goal and must exhaust the entire chamber before backtracking.",
      },
      {
        question: "How does weighted terrain affect A* pathfinding?",
        answer:
          "Each grid cell has a movement cost. Normal cells cost 1, mud costs 5, and water costs 10. A* will take a geometrically longer path around high-cost terrain if the total cumulative path cost is lower.",
      },
    ],
  },
};

export function createDsaMetadata(content: DsaContent): Metadata {
  const pageUrl = `https://www.openlabs.org.in/computer-science/dsa/${content.route}`;

  return {
    title: content.pageTitle,
    description: content.metaDescription,
    keywords: [
      `${content.name} visualizer`,
      `${content.name} DSA lab`,
      `${content.name} interactive simulator`,
      `${content.name} algorithm`,
      "data structures and algorithms",
      "DSA visualizer",
      "computer science lab",
      "OpenLabs DSA",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: content.pageTitle,
      description: content.metaDescription,
      url: pageUrl,
      siteName: "OpenLabs",
      type: "website",
      images: [
        {
          url: "https://www.openlabs.org.in/images/og-image.svg",
          width: 1200,
          height: 630,
          alt: `OpenLabs ${content.name} Visualizer`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.pageTitle,
      description: content.metaDescription,
      images: ["https://www.openlabs.org.in/images/twitter-image.svg"],
    },
  };
}
