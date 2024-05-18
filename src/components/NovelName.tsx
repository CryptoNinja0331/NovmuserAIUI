'use client'
import { useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { Input } from './ui/input';

const NovelName = ({ novelName }: { novelName: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(novelName);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Perform any necessary actions with the edited name
        console.log('Edited name:', editedName);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedName(e.target.value);
    };

    return (
        <div className="border-b text-white flex gap-4 px-2 items-center border-input pb-2 font-semibold capitalize text-[1.1rem]">
            {isEditing ? (
                <div className='w-1/2 flex items-center gap-4'>
                    <Input
                        type="text"
                        defaultValue={novelName}
                        onChange={handleChange}
                        className="bg-transparent text-white outline-none"
                    />
                    <FaSave onClick={handleSave} className=" cursor-pointer" />
                </div>
            ) : (
                <>
                    <p className="text-white">{novelName}</p>
                    <FaEdit onClick={handleEdit} className="text-sm cursor-pointer" />
                </>
            )}
        </div>
    );
};

export default NovelName;