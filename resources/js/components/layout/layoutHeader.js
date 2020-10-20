import React from "react";
import { Layout, Breadcrumb, Menu } from "antd";
import {} from "antd";
import { Link } from "react-router-dom";
import { PieChartOutlined, SettingOutlined } from "@ant-design/icons";
const LayoutHeader = () => {
    const { Header } = Layout;
    const handleLogout = () => {
        localStorage.removeItem("token");
        location.reload();
    };
    const userdata = JSON.parse(localStorage.userdata);

    return (
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
            <div className="logo" />
            <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={[location.pathname]}
                defaultOpenKeys={[]}
                // className="pull-left"
            >
                <Menu.Item key="/folders">
                    <Link to="/folders">Folders</Link>
                </Menu.Item>
                {userdata.role != "Staff" && (
                    <Menu.Item key="/users">
                        <Link to="/users">Users</Link>
                    </Menu.Item>
                )}

                <Menu.SubMenu
                    title=""
                    className="pull-right "
                    icon={<SettingOutlined style={{ marginRight: "0px" }} />}
                    key="/settings"
                >
                    <Menu.Item key="settings_logout">
                        <Link
                            to="/settings/logout"
                            onClick={e => handleLogout()}
                        >
                            Logout
                        </Link>
                    </Menu.Item>
                </Menu.SubMenu>
            </Menu>
            {/* <Menu theme="light" mode="horizontal" className="pull-right">
                <Menu.Item key="1">
                    <Link to="#">Logout</Link>
                </Menu.Item>
            </Menu> */}
        </Header>
    );
};

export default LayoutHeader;
