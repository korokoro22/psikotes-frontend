'use client';

import { useEffect, useRef, useState } from 'react';

type CameraStatus = 'idle' | 'loading' | 'granted' | 'denied';

export default function Camera() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [status, setStatus] = useState<CameraStatus>('idle');
    const streamRef = useRef<MediaStream | null>(null);

    const stopStream = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
    };

    const startCamera = async () => {
        setStatus('loading');
        try {
            // Request video saja, tidak bergantung pada mic
            const videoStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 100, height: 60, facingMode: 'user' },
            });

            // Request audio terpisah, gagal tidak masalah
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioStream.getAudioTracks().forEach((track) => videoStream.addTrack(track));
            } catch {
                // Mic tidak tersedia atau ditolak, kamera tetap jalan
            }

            streamRef.current = videoStream;

            // Hanya watch video track untuk status kamera
            videoStream.getVideoTracks().forEach((track) => {
                track.onended = () => {
                    stopStream();
                    setStatus('denied');
                };
            });

            if (videoRef.current) {
                videoRef.current.srcObject = videoStream;
            }
            setStatus('granted');
        } catch {
            setStatus('denied');
        }
    };

    useEffect(() => {
        let permissionResult: PermissionStatus | null = null;

        const handlePermissionChange = (result: PermissionStatus) => {
            if (result.state === 'granted') {
                startCamera();
            } else if (result.state === 'denied' || result.state === 'prompt') {
                stopStream();
                setStatus('denied');
            }
        };

        const watchPermission = async () => {
            try {
                const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
                permissionResult = result;
                result.onchange = () => handlePermissionChange(result);
            } catch {
                // browser tidak support permissions API, fallback ke track.onended saja
            }
        };

        startCamera();
        watchPermission();

        return () => {
            stopStream();
            if (permissionResult) permissionResult.onchange = null;
        };
    }, []);

    return (
        <div className="w-25 h-15 overflow-hidden rounded border shadow-md flex items-center justify-center bg-gray-100">
            {status === 'denied' ? (
                <div className="flex flex-col items-center gap-1 p-1 text-center">
                    <p className="text-xs text-red-500 leading-tight">Tidak ada akses kamera</p>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                />
            )}
        </div>
    );
}   