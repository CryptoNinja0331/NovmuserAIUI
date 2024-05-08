import { Textarea } from "./textarea";

export const FormGroup = ({ label, value, className }: { label: string, value: string }) => (
    <div className=''>
        <div className={`${className}`}>
            <h1 className='mb-2 inline-block flex font-medium text-[1.1rem]'>{label}</h1>
            <Textarea defaultValue={value} className='  ' />
        </div>
    </div>
);