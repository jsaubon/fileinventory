import {
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Modal,
    notification,
    Popconfirm,
    Row,
    Table,
    Tag
} from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { fetchData } from "../../../axios";
import ButtonGroup from "antd/lib/button/button-group";
import {
    EditOutlined,
    DeleteOutlined,
    PlusSquareOutlined,
    InboxOutlined
} from "@ant-design/icons";
import { CirclePicker } from "react-color";
import TextArea from "antd/lib/input/TextArea";
import Dragger from "antd/lib/upload/Dragger";
import Axios from "axios";

const PageFolders = () => {
    const userdata = JSON.parse(localStorage.userdata);
    const [folders, setFolders] = useState([]);
    const [searchFor, setSearchFor] = useState("");
    const [showAddEditFolder, setShowAddEditFolder] = useState(false);
    const toggleAddEditFolder = (
        data = {
            color: "",
            color_no: "",
            case_no: "",
            case_type: "",
            client_name: "",
            status: "",
            notes: "",
            folder_files: []
        }
    ) => {
        // console.log(data);
        setFolderData(data);
        setShowAddEditFolder(!showAddEditFolder);
    };
    const [folderData, setFolderData] = useState();
    useEffect(() => {
        getFolders();
        return () => {};
    }, [searchFor]);
    const getFolders = () => {
        fetchData("GET", "api/folder?search=" + searchFor).then(res => {
            if (res.success) {
                console.log(res);
                setFolders(res.data);
            }
        });
    };
    const handleChangeColor = color => {
        fetchData("POST", "api/folder", {
            action: "change_color",
            color: color.hex
        }).then(res => {
            if (res.success) {
                setFolderData({
                    ...folderData,
                    color_no: res.data,
                    color: color.hex
                });
            }
        });
    };

    let formRef;

    const uploadProps = {
        name: "file",
        multiple: true,
        customRequest: ({ file, onSuccess }) => {
            var formData = new FormData();
            formData.append("file", file);
            fetchData("POST_FILE", "api/folder/upload", formData).then(res => {
                onSuccess();
                setFolderData({
                    ...folderData,
                    folder_files: [...folderData.folder_files, res.data]
                });
            });
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (status === "done") {
                message.success(
                    `${info.file.name} file uploaded successfully.`
                );
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        }
    };

    const submitForm = e => {
        let data = { ...e };
        data.color = data.color.hex ? data.color.hex : data.color;
        data.folder_files = folderData.folder_files;
        data.color_no = folderData.color_no;
        data.id = folderData.id ? folderData.id : null;
        // console.log(data);
        fetchData(
            data.id ? "UPDATE" : "POST",
            `api/folder${data.id ? `/${data.id}` : ""}`,
            data
        ).then(res => {
            // console.log(res);
            getFolders();
            toggleAddEditFolder();
            notification.success({
                message: `Folder Successfully ${
                    data.id ? "Updated" : "Created"
                }`
            });
        });
    };

    const handleDeleteFolder = record => {
        fetchData("DELETE", "api/folder/" + record.id).then(res => {
            if (res.success) {
                getFolders();
                notification.success({
                    message: "Folder Successfully Deleted"
                });
            }
        });
    };

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
                            onClick={e => toggleAddEditFolder()}
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
                        <Table.Column
                            title="Tag"
                            dataIndex="id"
                            key="id"
                            render={(text, record) => {
                                return (
                                    <div
                                        style={{
                                            background: record.color,
                                            minWidth: 40,
                                            height: 40,
                                            textAlign: "center",
                                            fontSize: 25,
                                            borderRadius: 50
                                        }}
                                    >
                                        {record.color_no}
                                    </div>
                                );
                            }}
                        />
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
                            render={(text, record) => {
                                return (
                                    <div style={{ whiteSpace: "pre" }}>
                                        {record.notes}
                                    </div>
                                );
                            }}
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
                                return (
                                    <>
                                        By: {record.user.name} <br /> At:{" "}
                                        {moment(record.updated_at).format(
                                            "YYYY-MM-DD hh:mm A"
                                        )}
                                    </>
                                );
                            }}
                        />
                        <Table.Column
                            title="Files"
                            dataIndex="files"
                            key="files"
                            render={(text, record) => {
                                console.log(record);
                                let files = [];
                                record.folder_files.forEach(file => {
                                    files.push(
                                        <Tag
                                            style={{ cursor: "pointer" }}
                                            onClick={e =>
                                                window.open(
                                                    file.file_path.replace(
                                                        "public",
                                                        window.location.origin +
                                                            "/storage/"
                                                    ),
                                                    "_blank",
                                                    "download=" + file.file_name
                                                )
                                            }
                                        >
                                            {file.file_name}
                                        </Tag>
                                    );
                                });

                                return files;
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
                                            onClick={e =>
                                                toggleAddEditFolder(record)
                                            }
                                        ></Button>
                                        {userdata.role != "Staff" && (
                                            <Popconfirm
                                                title="Are you sure you want to delete this folder?"
                                                okText="Yes"
                                                cancelText="No"
                                                onConfirm={e =>
                                                    handleDeleteFolder(record)
                                                }
                                            >
                                                <Button
                                                    type="primary"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                ></Button>
                                            </Popconfirm>
                                        )}
                                    </ButtonGroup>
                                );
                            }}
                        />
                    </Table>
                </div>
            </Card>
            {showAddEditFolder && (
                <Modal
                    visible={showAddEditFolder}
                    onCancel={toggleAddEditFolder}
                    onOk={e => formRef.submit()}
                    title={`Folder Information`}
                    okText="Save"
                    cancelText="Close"
                >
                    {folderData.color_no && (
                        <div
                            style={{
                                background: folderData.color,
                                width: 100,
                                height: 100,
                                textAlign: "center",
                                fontSize: 25,
                                borderRadius: 50,
                                paddingTop: 28,
                                margin: "auto"
                            }}
                        >
                            {folderData.color_no}
                        </div>
                    )}
                    <Form
                        initialValues={folderData}
                        layout="vertical"
                        onFinish={e => submitForm(e)}
                        ref={e => (formRef = e)}
                    >
                        <Row>
                            <Col xs={24} md={24}>
                                <Form.Item
                                    label="Folder Color"
                                    name="color"
                                    className="text-center"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Pick Folder Color"
                                        }
                                    ]}
                                >
                                    <CirclePicker
                                        width="100%"
                                        circleSize={20}
                                        circleSpacing={10}
                                        onChangeComplete={(color, event) => {
                                            handleChangeColor(color);
                                        }}
                                        colors={[
                                            "#f44336",
                                            "#03a9f4",
                                            "#4caf50",
                                            "#ffeb3b",
                                            "#ff9800",
                                            "#e91e63",
                                            "#795548"
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Case #" name="case_no">
                                    <Input placeholder="Case #" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Case Type" name="case_type">
                                    <Input placeholder="Case Type" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Client Name"
                                    name="client_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Input Client Name"
                                        }
                                    ]}
                                >
                                    <Input placeholder="Client Name" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Status" name="status">
                                    <Input placeholder="Status" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Notes" name="notes">
                            <TextArea placeholder="Case #" />
                        </Form.Item>

                        <Dragger {...uploadProps}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click or drag file to this area to upload
                            </p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly
                                prohibit from uploading company data or other
                                band files
                            </p>
                        </Dragger>
                    </Form>
                </Modal>
            )}
        </div>
    );
};

export default PageFolders;
