import Link from "next/link"
import { ReactNode } from "react"

interface ModalProps {
    isOpen: boolean
    onClose: ()=> void
    children: ReactNode
}

const PermissionModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if(!isOpen) return null

    return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                <div className="p-8 border border-white w-96 shadow-lg rounded-md bg-white md:mt-20">
                    <div className="text-center">
                    {children}
                    </div>
                </div>
            </div>
    )
}

export default PermissionModal