import React, { Component } from 'react';
import { loginEmailPassword } from '../../../services'
import { Container,  Row, Col, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import theme from '../theme.css';



export default class AuthControls extends Component {
    state = {
        email: '',
        password: '',
        errorMsg: null
    };

    _handleLogin = async () => {
        const { setUser } = this.props;
        const { email, password } = this.state;

        // login into Stitch app
        try {
            const user = await loginEmailPassword(email, password);
            console.log('User:', user);
            setUser(user)
        } catch (error) {
            this.setState({errorMsg: error.message})
        }
    };

    render() {
        return (
            <Container className={theme.loginWrapper}>
                <Row>
                    <Col xs="6">
                        <Form>
                            <FormGroup>
                                <Label for="inputEmail">Email</Label>
                                <Input
                                    value={this.state.email}
                                    onChange={this.handleEmailChange}
                                    id="inputEmail"
                                    type="email"
                                    name="email"
                                    placeholder="Your Email" />
                            </FormGroup>
                            <FormGroup>
                                <Label for="inputPassword">Password</Label>
                                <Input
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                    id="inputPassword"
                                    type="password"
                                    name="password"
                                    placeholder="Your Password" />
                            </FormGroup>
                            { this.state.errorMsg && <Alert color="danger">
                                { this.state.errorMsg }
                            </Alert> }

                            <Button outline color="primary"
                                onClick={this._handleLogin}
                            >
                                Log In
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    };

    handleEmailChange = (event) => this.setState({email: event.target.value});
    handlePasswordChange = (event) => this.setState({password: event.target.value});
}
