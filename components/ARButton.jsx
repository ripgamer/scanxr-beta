'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button'; // shadcn/ui button
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'; // shadcn/ui dialog
import AFrameScene from './AFrameScene';

const ARButton = ({ gltfUrl, buttonText = "Launch AR" }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-4 rounded shadow hover:from-blue-600 hover:to-purple-700 transition-all">
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-full w-screen h-screen p-0 bg-black"
        style={{ maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden' }}
      >
        <AFrameScene gltfUrl={gltfUrl} />
      </DialogContent>
    </Dialog>
  );
};

export default ARButton;
