'use client';

import { useEffect, useRef, useState } from 'react';

export default function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 100,
                        height: 60,
                        facingMode: 'user',
                    },
                    audio: true,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                setError('Kamera tidak dapat diakses.');
                console.error(err);
            }
        };

        startCamera();

        return () => {
            stream?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    if (error) {
        return (
            <div className="w-36 h-20 rounded border border-red-500 p-4 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="w-25 h-15 overflow-hidden rounded border shadow-md">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
            />
        </div>
    );
}