import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sorting Algorithms Visualizer | CS Lab',
    description: 'Explore sorting algorithms with interactive visualizations. Learn Bubble Sort, Merge Sort, Quick Sort, Heap Sort, and Selection Sort.',
    keywords: [
        'sorting algorithms', 'bubble sort', 'merge sort', 'quick sort',
        'heap sort', 'selection sort', 'algorithm visualization', 'computer science'
    ],
    openGraph: {
        title: 'Sorting Algorithms Visualizer | OpenLabs',
        description: 'Explore sorting algorithms with interactive visualizations for computer science learning.',
        url: '/computer-science/dsa/sorting',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        images: ['/images/twitter-image.svg'],
        title: 'Sorting Algorithms Visualizer | OpenLabs',
        description: 'Explore sorting algorithms with interactive visualizations for computer science learning.',
    },
    alternates: {
        canonical: '/computer-science/dsa/sorting',
    },
}

export default function SortingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}