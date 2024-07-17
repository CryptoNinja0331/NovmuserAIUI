import React from 'react';
import { FaRegEdit } from "react-icons/fa";
import { Textarea } from '../ui/textarea';


interface CharacterProfileUiProps {
    novelMsg: any | null;
}

const CharacterProfileUi: React.FC<CharacterProfileUiProps> = ({ novelMsg }) => {
    const data = novelMsg.msg || {}


    return (
        <div className='charecter'>
            <div className='flex items-center justify-between my-4 border-b-2 pb-2 border-dashed border-[#eaaaff33]'>
                <h1 className='text-violet-gradient text-xl mb-2 font-semibold '>Character Profile</h1>
                <FaRegEdit className='text-[#B997E3] text-xl cursor-pointer' />
            </div>
            <div className=' mx-auto'>
                <div className=' my-4 border-b-2 pb-2 border-dashed border-[#eaaaff33]'>
                    <h1 className='text-violet-gradient  mb-2 font-semibold text-center'>Main Characters</h1>
                </div>
                <div className='flex gap-16 items-center w-full'>

                    {data?.main_characters?.map((character: any, index: number) => {
                        // Extract keys from the character object
                        const keys = Object.keys(character);


                        return (
                            <div key={index} className='gird grid-cols-2 gap-4 w-full'>
                                <div>
                                    {keys.map((key: string, keyIndex: number) => (
                                        <div key={keyIndex} className='justify-center items-center gap-4 mt-4 w-full'>
                                            <p className='text-[#eee0ff66] capitalize mb-2 font-medium text-[1rem]'>{key}</p>
                                            <Textarea style={{ minHeight: "110px" }} defaultValue={character[key]} className='text-[#eee0ffd9]  font-semibold text-sm' />
                                        </div>
                                    ))}
                                </div>

                                {/* <div>
                                    {remainingKeys.map((key: string, keyIndex: number) => (
                                        <div key={keyIndex} className='justify-center items-center gap-4'>
                                            <p className='text-[#eee0ff66] capitalize mb-2 font-medium text-[1rem]'>{key}</p>
                                            <Input type='text' defaultValue={character[key]} className='text-[#eee0ffd9] border-none bg-transparent px-0 font-semibold text-[1rem]' />
                                        </div>
                                    ))}
                                </div> */}
                            </div>
                        );
                    })}
                </div>


                <div>
                    <div className=' my-4 border-b-2 pb-2 border-dashed border-[#eaaaff33] mt-8'>
                        <h1 className='text-violet-gradient  mb-2 font-semibold text-center'>Supporting Characters</h1>
                    </div>

                    <div className='gird grid-cols-2 gap-4 w-full'>
                        {data?.supporting_characters?.map((character: any, index: number) => {
                            // Extract keys from the character object
                            const keys = Object.keys(character);

                            return (
                                <div key={index} className='gird grid-cols-2 gap-4 w-full'>
                                    <div>
                                        {keys.map((key: string, keyIndex: number) => (
                                            <div key={keyIndex} className='justify-center items-center gap-4 mt-4'>
                                                <p className='text-[#eee0ff66] capitalize mb-2 font-medium text-[1rem]'>{key}</p>
                                                <Textarea style={{ minHeight: "110px" }} defaultValue={character[key]} className='text-[#eee0ffd9] font-semibold text-sm' />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CharacterProfileUi;
