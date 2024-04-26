'use client'
import {ModalCheckboxFilter} from "@/components/MapFilter/ModalCheckboxFilter";
import virginiaCityAndZip from "@/utils/virginia";
import {useState} from "react";


interface ModalMapSearchProps {

}

export const ModalMapSearch = (props: ModalMapSearchProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
      <ModalCheckboxFilter
          selections={virginiaCityAndZip}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
      />
  )
}
