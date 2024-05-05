import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { FaRegEdit } from "react-icons/fa";
interface WorldViewUiProps {
    novelMsg: string | null;
}

const WorldViewUi: React.FC<WorldViewUiProps> = ({ novelMsg }) => {
    const data = JSON.parse(novelMsg || '{}');
    const { novel_type,
        novel_style,
        point_of_view,
        geography,
        politics,
        economy,
        culture,
        history } = JSON.parse(data.msg)

    return (
        <div>
            <div className='flex items-center justify-between my-4 border-b-2 pb-2 border-dashed border-[#eaaaff33]'>
                <h1 className='text-violet-gradient text-xl mb-2 font-semibold '>World View</h1>
                <FaRegEdit className='text-[#B997E3] text-xl cursor-pointer' />
            </div>
            <div className='flex gap-8 w-full mt-5'>
                <div className='form-group w-1/2'>
                    <Label className='mb-2 inline-block' htmlFor="email">Novel Type</Label>
                    <Input defaultValue={novel_type} className='border-none bg-[#20172D] font-medium text-sm text-[#dedede]' type="email" id="email" />
                </div>
                <div className='form-group w-1/2'>
                    <Label className='mb-2 inline-block' htmlFor="email">Novel Style</Label>
                    <Input defaultValue={novel_style} className='border-none font-medium bg-[#20172D]' type="email" id="email" />
                </div>
            </div>

            <div className='mt-4'>
                <div className='form-group'>
                    <Label className='mb-2 inline-block' htmlFor="email">Part Of view</Label>
                    <Input defaultValue={point_of_view} className='border-none font-medium bg-[#20172D]' type="email" id="email" />
                </div>
            </div>
        </div>
    );
};

export default WorldViewUi;