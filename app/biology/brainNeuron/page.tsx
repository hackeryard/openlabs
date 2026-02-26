import BrainNeuron from '@/app/components/biology/brainNeuron/BrainNeuron';

export const metadata = {
  title: 'Brain Neuron Simulation | OpenLabs',
  description: 'Interactive 3D brain neuron simulation for neuroscience education',
};

export default function BrainNeuronPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <BrainNeuron />
    </div>
  );
}