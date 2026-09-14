import { useState } from 'react'

export const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onOpenChange: (open: boolean) => setIsOpen(open),
  }
}
