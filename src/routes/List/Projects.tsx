import * as React from 'react';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { Row, Col, Form, Card, Select, List } from 'antd';

import TagSelect from '../../components/TagSelect';
import AvatarList from '../../components/AvatarList';
import Ellipsis from '../../components/Ellipsis';
import StandardFormRow from '../../components/StandardFormRow';

import './Projects.less';

const { Option } = Select;
const FormItem = Form.Item;

@inject((store:{FakeList})=>{
    return {
        list: store.FakeList.list,
        getList: store.FakeList.getList,
        clearList: store.FakeList.clearList,
        loading: store.FakeList.loading,
    }
})
@observer
class CoverCardList extends React.Component<{form, list, loading: boolean, getList:(params)=>void, clearList: ()=>void}> {
    public componentDidMount() {
        this.props.getList({count: 8});
    }

    public componentWillUnmount() {
        this.props.clearList();
    }

    private handleFormSubmit = () => {
        const { form } = this.props;
        // setTimeout 用于保证获取表单值是在所有表单字段更新完毕的时候
        setTimeout(() => {
            form.validateFields(err => {
                if (!err) {
                    this.props.getList({count: 8});
                }
            });
        }, 0);
    };

    public render() {
        const { list=[], loading, form } = this.props;
        const { getFieldDecorator } = form;

        // const cardList = list ? (
        //     <List
        //         rowKey="id"
        //         loading={loading}
        //         grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        //         dataSource={list}
        //         renderItem={item => (
        //             <List.Item>
        //                 <Card
        //                     className={'card'}
        //                     hoverable={true}
        //                     cover={<img alt={item.title} src={item.cover} height={154} />}
        //                 >
        //                     <Card.Meta
        //                         title={<a href="#">{item.title}</a>}
        //                         description={<Ellipsis lines={2}>{item.subDescription}</Ellipsis>}
        //                     />
        //                     <div className={'cardItemContent'}>
        //                         <span>{moment(item.updatedAt).fromNow()}</span>
        //                         <div className={'avatarList'}>
        //                             <AvatarList size="mini">
        //                                 {item.members.map((member, i) => (
        //                                     <AvatarList.Item
        //                                         key={`${item.id}-avatar-${i}`}
        //                                         src={member.avatar}
        //                                         tips={member.name}
        //                                     />
        //                                 ))}
        //                             </AvatarList>
        //                         </div>
        //                     </div>
        //                 </Card>
        //             </List.Item>
        //         )}
        //     />
        // ) : null;

        const formItemLayout = {
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <div className={'coverCardList'}>
                <Card bordered={false}>
                    <Form layout="inline">
                        <StandardFormRow title="所属类目" block={true} style={{ paddingBottom: 11 }}>
                            <FormItem>
                                {getFieldDecorator('category')(
                                    <TagSelect onChange={this.handleFormSubmit} expandable={true}>
                                        <TagSelect.Option value="cat1">类目一</TagSelect.Option>
                                        <TagSelect.Option value="cat2">类目二</TagSelect.Option>
                                        <TagSelect.Option value="cat3">类目三</TagSelect.Option>
                                        <TagSelect.Option value="cat4">类目四</TagSelect.Option>
                                        <TagSelect.Option value="cat5">类目五</TagSelect.Option>
                                        <TagSelect.Option value="cat6">类目六</TagSelect.Option>
                                        <TagSelect.Option value="cat7">类目七</TagSelect.Option>
                                        <TagSelect.Option value="cat8">类目八</TagSelect.Option>
                                        <TagSelect.Option value="cat9">类目九</TagSelect.Option>
                                        <TagSelect.Option value="cat10">类目十</TagSelect.Option>
                                        <TagSelect.Option value="cat11">类目十一</TagSelect.Option>
                                        <TagSelect.Option value="cat12">类目十二</TagSelect.Option>
                                    </TagSelect>
                                )}
                            </FormItem>
                        </StandardFormRow>
                        <StandardFormRow title="其它选项" grid={true} last={true}>
                            <Row gutter={16}>
                                <Col lg={8} md={10} sm={10} xs={24}>
                                    <FormItem {...formItemLayout} label="作者">
                                        {getFieldDecorator('author', {})(
                                            <Select
                                                onChange={this.handleFormSubmit}
                                                placeholder="不限"
                                                style={{ maxWidth: 200, width: '100%' }}
                                            >
                                                <Option value="lisa">王昭君</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                                <Col lg={8} md={10} sm={10} xs={24}>
                                    <FormItem {...formItemLayout} label="好评度">
                                        {getFieldDecorator('rate', {})(
                                            <Select
                                                onChange={this.handleFormSubmit}
                                                placeholder="不限"
                                                style={{ maxWidth: 200, width: '100%' }}
                                            >
                                                <Option value="good">优秀</Option>
                                                <Option value="normal">普通</Option>
                                            </Select>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </StandardFormRow>
                    </Form>
                </Card>
                {/* <div className={'cardList'}>{cardList}</div> */}
            </div>
        );
    }
}

export default Form.create()(CoverCardList);
