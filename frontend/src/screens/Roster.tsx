import React from 'react'
import { useGetCyclistsQuery } from '../slices/cyclistApiSlice'
import { Cyclist } from '../interfaces/Cyclist'

type Props = {}

const Roster = (props: Props) => {

  const { data: cyclists } = useGetCyclistsQuery({});
  console.log(cyclists)
  return (
    <>
      {cyclists.map((cyclist: Cyclist) => (
        <div key={cyclist._id}>
          {cyclist.name} {/* Display cyclist data */}
        </div>
      ))}
    </>
  );
}

export default Roster