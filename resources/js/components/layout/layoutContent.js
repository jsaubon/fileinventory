import React, { useEffect, useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Layout, Breadcrumb } from "antd";
import LayoutHeader from "./LayoutHeader";
import LayoutFooter from "./LayoutFooter";
import PageFolders from "../pages/private/PageFolders";

const LayoutContent = () => {
    const { Content } = Layout;

    return (
        <Layout className="layout">
            <LayoutHeader />
            <Content
                className="site-layout"
                style={{ padding: "0 50px", marginTop: 64 }}
            >
                <div
                    className="site-layout-background"
                    style={{ padding: 24, minHeight: 380 }}
                >
                    <Switch>
                        <Route exact path="/folders" component={PageFolders} />
                        <Route path="/" exact>
                            <Redirect to="/folders" />
                        </Route>
                    </Switch>
                </div>
            </Content>
            <LayoutFooter />
        </Layout>
    );
};

export default LayoutContent;
