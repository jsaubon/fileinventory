import { Card, Input, Table } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { fetchData } from "../../../axios";

const PageFolders = () => {
    const [folders, setFolders] = useState([]);
    const [searchFor, setSearchFor] = useState("");
    useEffect(() => {
        fetchData("GET", "api/folder?search=" + searchFor).then(res => {
            console.log(res);
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
                <Input.Search
                    enterButton={true}
                    onSearch={e => setSearchFor(e)}
                    placeholder="Search here"
                />
                <div style={{ overflowX: "auto", marginTop: 10 }}>
                    <Table dataSource={folders} pagination={false}>
                        <Table.Column
                            title="Tag"
                            dataIndex="id"
                            key="id"
                            // onFilter={(value, record) =>
                            //     record.status.indexOf(value) === 0
                            // }
                            // filters={[
                            //     {
                            //         text: "Active",
                            //         value: "Active"
                            //     },
                            //     {
                            //         text: "Inactive",
                            //         value: "Inactive"
                            //     },
                            //     {
                            //         text: "Resigned",
                            //         value: "Resigned"
                            //     }
                            // ]}
                            // sorter={(a, b) => a.id.length - b.id.length}
                            // sortDirections={["descend", "ascend"]}
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
                    </Table>
                </div>
            </Card>
        </div>
    );
};

export default PageFolders;
