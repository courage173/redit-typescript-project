import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react'
import { InputHTMLAttributes } from 'react';

type inputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string,
    label: string,
}

export const InputField: React.FC<inputFieldProps> = ({label,size: _, ...props}) => {
    const [field, {error}] = useField(props)
        return (
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor={field.name}>{label}</FormLabel>
                <Input {...field} {...props} id={field.name} placeholder={props.placeholder} />
                {error? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        );
}