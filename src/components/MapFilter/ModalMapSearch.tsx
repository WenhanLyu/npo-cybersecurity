'use client'
import {ModalCheckboxFilter} from "@/components/MapFilter/ModalCheckboxFilter";
import virginiaCityAndZip from "@/utils/virginia";


interface ModalMapSearchProps {

}

export const ModalMapSearch = (props: ModalMapSearchProps) => {

  return (
      <ModalCheckboxFilter
          selections={virginiaCityAndZip}
          isOpen={true}
          onClose={() => {
          }}
      />
  )
}
