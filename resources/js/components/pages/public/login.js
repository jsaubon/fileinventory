import React, { useState } from "react";
import { Layout, Row, Col, Form, Input, Checkbox, Button, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import { fetchData } from "../../../axios";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState();
    const [loadingButtonLogin, setLoadingButtonLogin] = useState(false);
    const onFinish = values => {
        if (values.remember) {
            localStorage.email = values.email;
            localStorage.password = values.password;
            localStorage.remember = values.remember;
        } else {
            localStorage.email = "";
            localStorage.password = "";
            localStorage.remember = false;
        }
        setLoadingButtonLogin(true);
        setErrorMessage(undefined);
        let data = { email: values.email, password: values.password };
        fetchData("POST", "api/login", data)
            .then(res => {
                setLoadingButtonLogin(false);
                if (res.token) {
                    localStorage.token = res.token;
                    localStorage.userdata = JSON.stringify(res.data);
                    location.reload();
                } else {
                }
            })
            .catch(err => {
                setLoadingButtonLogin(false);
                setErrorMessage(err.response.data.error);
            });
    };

    return (
        <Layout className="layout">
            <Layout.Content
                className="site-layout"
                style={{ padding: "0 50px", marginTop: 64, height: "100vh" }}
            >
                <Row>
                    <Col xs={0} md={6}></Col>
                    <Col xs={24} md={12}>
                        <div
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                textAlign: "center",
                                width: "100%",
                                margin: "auto",
                                background: "#fff"
                            }}
                        >
                            <div className="login-logo"></div>
                            <div
                                style={{
                                    maxWidth: 300,
                                    margin: "auto",
                                    marginTop: "20px"
                                }}
                            >
                                <Title level={3}>File Inventory System</Title>
                                <Text type="secondary">
                                    Sign In to your account
                                </Text>
                                <Form
                                    name="normal_login"
                                    className="login-form "
                                    initialValues={{
                                        remember:
                                            localStorage.remember == "false"
                                                ? false
                                                : true,
                                        email: localStorage.email,
                                        password: localStorage.password
                                    }}
                                    onFinish={onFinish}
                                >
                                    <Form.Item
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Username!"
                                            }
                                        ]}
                                        className="mb-0"
                                    >
                                        <Input
                                            prefix={
                                                <UserOutlined className="site-form-item-icon" />
                                            }
                                            placeholder="Username"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Please input your Password!"
                                            }
                                        ]}
                                        className="mb-0"
                                    >
                                        <Input
                                            prefix={
                                                <LockOutlined className="site-form-item-icon" />
                                            }
                                            type="password"
                                            placeholder="Password"
                                        />
                                    </Form.Item>
                                    {errorMessage && (
                                        <Alert
                                            className="mt-10"
                                            type="error"
                                            message={errorMessage}
                                        />
                                    )}
                                    <Form.Item className="mb-0">
                                        <Form.Item
                                            name="remember"
                                            valuePropName="checked"
                                            noStyle
                                        >
                                            <Checkbox>Remember me</Checkbox>
                                        </Form.Item>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            loading={loadingButtonLogin}
                                            type="primary"
                                            htmlType="submit"
                                            className="login-form-button"
                                        >
                                            Log in
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </Col>
                    <Col xs={0} md={6}></Col>
                </Row>
            </Layout.Content>
        </Layout>
    );
};

export default Login;
