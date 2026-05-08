import BrainNeuron from '@/app/components/biology/brainNeuron/BrainNeuron';

export const metadata = {
  title: 'Brain Neuron Simulation | OpenLabs',
  description: 'Interactive 3D brain neuron simulation for neuroscience education. Explore neural networks, synaptic transmission, and brain cell structure.',
  keywords: [
    'brain neuron simulation', 'neuroscience education', '3D neuron model', 'neural networks',
    'synaptic transmission', 'brain cell structure', 'interactive biology', 'neuroscience lab'
  ],
  openGraph: {
    title: 'Brain Neuron Simulation | OpenLabs',
    description: 'Interactive 3D brain neuron simulation for neuroscience education.',
    url: '/biology/brainNeuron',
    type: 'website',
    images: [
      {
        url: '/images/biology/brain-neuron-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Brain Neuron Simulation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/twitter-image.svg'],
    title: 'Brain Neuron Simulation | OpenLabs',
    description: 'Interactive 3D brain neuron simulation for neuroscience education.',
  },
  alternates: {
    canonical: '/biology/brainNeuron',
  },
};

export default function BrainNeuronPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <BrainNeuron />
    </div>
  );
}