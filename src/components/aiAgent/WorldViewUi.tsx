import React from 'react';
import { FaRegEdit } from "react-icons/fa";
import { FormGroup } from '../ui/form-group';

interface WorldViewUiProps {
    novelMsg: string | null;
}



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
            <div className='mt-4'>
                <FormGroup label="Point Of View" value={point_of_view} />
            </div>

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




            <div className='mt-4'>
                <FormGroup label="Economy" value={economy} />
            </div>

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