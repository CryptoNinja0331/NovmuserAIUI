import { Input } from "./input";

export const FormGroup = ({ label, value, className }: { label: string, value: string }) => (
    <div className=''>
        <div className={`${className}`}>
            <h1 className='mb-2 inline-block flex'>{label}</h1>
            <Input defaultValue={value} className='border-none font-medium bg-transparent' type="email" id="email" />
        </div>
    </div>
);