import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://127.0.0.1:8000/api";

const Signup = () => {
    const navigate = useNavigate();

    const [name, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const [validationError, setValidationError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password_confirmation', password_confirmation);

        try {
            await axios.get("/sanctum/csrf-cookie");
            const response = await axios.post(`/signup`, formData);
            Swal.fire({
                icon: "success",
                text: response.data.message
            });
            navigate("/");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setValidationError(error.response.data.errors);
            } else if (error.response) {
                Swal.fire({
                    text: error.response.data.message,
                    icon: "error"
                });
            } else {
                Swal.fire({
                    text: "An unexpected error occurred.",
                    icon: "error"
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='container'>
            {
                Object.keys(validationError).length > 0 && (
                    <div className="row">
                        <div className="col-12">
                            <div className="alert alert-danger">
                                <ul className="mb-0">
                                    {
                                        Object.entries(validationError).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                )
            }
            <Form onSubmit={createUser}>
                <Form.Group className="mb-3" controlId="formBasicFullname">
                    <Form.Label>Fullname</Form.Label>
                    <Form.Control type="text" placeholder="Enter fullname" value={name} onChange={(event) => setFullname(event.target.value)} />
                    <Form.Text className="text-muted">
                        example: John D. Doe
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter Email Address" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Confirm Password" value={password_confirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} />
                </Form.Group>

                <Button variant="primary" className="mt-2" size="lg" block="block" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </Form>
        </div>
    );
};

export default Signup;
