import { Button, Card, Col, Input, Row, Table } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { fetchData } from "../../../axios";
import ButtonGroup from "antd/lib/button/button-group";
import {
    EditOutlined,
    DeleteOutlined,
    PlusSquareOutlined
} from "@ant-design/icons";

const PageFolders = () => {
    const [folders, setFolders] = useState([]);
    const [searchFor, setSearchFor] = useState("");
    useEffect(() => {
        fetchData("GET", "api/folder?search=" + searchFor).then(res => {
            if (res.success) {
                setFolders(res.data);
            }
        });
        return () => {};
    }, [searchFor]);

    return (
        <div>
            <Title level={3}>Folders</Title>
            <Card>
                <Row>
                    <Col xs={24} md={6}>
                        <Button
                            type="primary"
                            icon={<PlusSquareOutlined />}
                            block
                        >
                            Add New Record
                        </Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col xs={24} md={6}>
                        <Title level={4}>List</Title>
                    </Col>
                    <Col xs={24} md={6}></Col>
                    <Col xs={24} md={6}></Col>
                    <Col xs={24} md={6}>
                        <Input.Search
                            enterButton={true}
                            onSearch={e => setSearchFor(e)}
                            placeholder="Search here"
                        />
                    </Col>
                </Row>

                <div style={{ overflowX: "auto", marginTop: 10 }}>
                    <Table dataSource={folders} pagination={false}>
                        <Table.Column title="Tag" dataIndex="id" key="id" />
                        <Table.Column
                            title="Case #"
                            dataIndex="case_no"
                            key="case_no"
                            sorter={(a, b) =>
                                a.case_no.length - b.case_no.length
                            }
                            sortDirections={["descend", "ascend"]}
                        />
                        <Table.Column
                            title="Case Type"
                            dataIndex="case_type"
                            key="case_type"
                        />
                        <Table.Column
                            title="Client Name"
                            dataIndex="client_name"
                            key="client_name"
                            sorter={(a, b) =>
                                a.client_name.length - b.client_name.length
                            }
                            sortDirections={["descend", "ascend"]}
                        />
                        <Table.Column
                            title="Status"
                            dataIndex="status"
                            key="status"
                        />

                        <Table.Column
                            title="Notes"
                            dataIndex="notes"
                            key="notes"
                        />
                        <Table.Column
                            title="Last Updated"
                            dataIndex="updated_at"
                            key="updated_at"
                            sorter={(a, b) =>
                                a.updated_at.length - b.updated_at.length
                            }
                            sortDirections={["descend", "ascend"]}
                            render={(text, record) => {
                                return moment(record.updated_at).format(
                                    "YYYY-MM-DD hh:mm A"
                                );
                            }}
                        />
                        <Table.Column
                            title="Action"
                            dataIndex="action"
                            key="action"
                            render={(text, record) => {
                                return (
                                    <ButtonGroup>
                                        <Button
                                            type="primary"
                                            icon={<EditOutlined />}
                                        ></Button>
                                        <Button
                                            type="primary"
                                            danger
                                            icon={<DeleteOutlined />}
                                        ></Button>
                                    </ButtonGroup>
                                );
                            }}
                        />
                    </Table>
                </div>
            </Card>
        </div>
    );
};

export default PageFolders;
