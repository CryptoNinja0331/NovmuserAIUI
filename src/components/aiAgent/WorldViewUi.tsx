import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { FaRegEdit } from "react-icons/fa";

interface WorldViewUiProps {
    novelMsg: string | null;
}

const FormGroup = ({ label, value }: { label: string, value: string }) => (
    <div className='mt-6'>
        <div className='form-group'>
            <Label className='mb-2 inline-block' htmlFor="email">{label}</Label>
            <Input defaultValue={value} className='border-none font-medium bg-[#20172D]' type="email" id="email" />
        </div>
    </div>
);

const WorldViewUi: React.FC<WorldViewUiProps> = ({ novelMsg }) => {
    const data = JSON.parse(novelMsg || '{}');
    const { novel_type, novel_style, point_of_view, geography, politics, economy, culture, history } = JSON.parse(data.msg);

    return (
        <div>
            <div className='flex items-center justify-between my-4 border-b-2 pb-2 border-dashed border-[#eaaaff33]'>
                <h1 className='text-violet-gradient text-xl mb-2 font-semibold '>World View</h1>
                <FaRegEdit className='text-[#B997E3] text-xl cursor-pointer' />
            </div>
            <div className='flex gap-8 justify-between items-center w-full mt-5'>
                <div className='w-1/2'>
                    <FormGroup label="Novel Type" value={novel_type} />
                </div>
                <div className='w-1/2'>
                    <FormGroup label="Novel Style" value={novel_style} />
                </div>
            </div>
            <FormGroup label="Point Of View" value={point_of_view} />

            <div className='my-8 border-b-2 pb-2 border-dashed border-[#eaaaff33]'>

            </div>


            <div className='flex gap-8 justify-between items-center w-full mt-5'>
                <div className='w-1/2'>
                    <FormGroup label="Geography" value={geography} />
                </div>
                <div className='w-1/2'>
                    <FormGroup label="Politics" value={politics} />
                </div>
            </div>




            <FormGroup label="Economy" value={economy} />

            <div className='flex gap-8 justify-between items-center w-full mt-5'>
                <div className='w-1/2'>
                    <FormGroup label="Culture" value={culture} />
                </div>
                <div className='w-1/2'>
                    <FormGroup label="History" value={history} />
                </div>
            </div>








        </div>
    );
};

export default WorldViewUi;