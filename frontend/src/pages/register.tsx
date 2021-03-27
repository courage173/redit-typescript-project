
import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React from 'react'
import { InputField } from '../components/inputField';
import Wrapper from '../components/Wrapper';
import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';

interface registerProps {

}

const Register: React.FC<registerProps> = ({}) => {
   const router = useRouter()
    const [, register] = useRegisterMutation();
        return (
            <Wrapper variant='small'>
                <Formik onSubmit={async (values,{setErrors}) => {
                    const response = await register(values)
                    if(response.data?.register.errors){
                        setErrors(toErrorMap(response.data.register.errors))
                    }else if(response.data?.register.user){
                        //do something man and do it well
                        router.push('/')
                    }
                }}
                initialValues={{username: '', password: ''}}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <InputField 
                                name='username'
                                placeholder='Username'
                                label='Username'

                            />
                            <Box mt={4}>
                            <InputField 
                                name='password'
                                placeholder='Password'
                                label='password'
                                type='password'
                            />
                            </Box>
                            <Button mt={4} 
                            type="submit" 
                            colorScheme="teal"
                            isLoading={isSubmitting}
                            >register</Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        )
}
 
export default  Register;