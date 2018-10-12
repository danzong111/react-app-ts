import * as React from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Select, Row, Col, Popover, Progress } from 'antd';
import './Register.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
    ok: <div className={'success'}>强度：强</div>,
    pass: <div className={'warning'}>强度：中</div>,
    poor: <div className={'error'}>强度：太短</div>,
};

const passwordProgressMap = {
    ok: 'success',
    pass: 'normal',
    poor: 'exception',
};

// @connect(({ register, loading }) => ({
//     register,
//     submitting: loading.effects['register/submit'],
// }))
class Register extends React.Component<{form, submitting, register, history}, {count: number, confirmDirty:boolean, visible: boolean, help: string, prefix: string}> {
    private interval;
    constructor(props){
        super(props);
        this.state={
            count: 0,
            confirmDirty: false,
            visible: false,
            help: '',
            prefix: '86',
        }
    }
    public componentWillReceiveProps(nextProps) {
        // const account = this.props.form.getFieldValue('mail');
        // if (nextProps.register.status === 'ok') {
            // this.props.dispatch(
            //     routerRedux.push({
            //         pathname: '/user/register-result',
            //         state: {
            //             account,
            //         },
            //     })
            // );
        // }
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    private onGetCaptcha = () => {
        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
            count -= 1;
            this.setState({ count });
            if (count === 0) {
                clearInterval(this.interval);
            }
        }, 1000);
    };

    private getPasswordStatus = () => {
        const { form } = this.props;
        const value = form.getFieldValue('password');
        if (value && value.length > 9) {
            return 'ok';
        }
        if (value && value.length > 5) {
            return 'pass';
        }
        return 'poor';
    };

    private handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields({ force: true }, (err, values) => {
            if (!err) {
                const account = this.props.form.getFieldValue('mail');
                this.props.history.push('/user/register-result');
                // this.props.dispatch({
                //     type: 'register/submit',
                //     payload: {
                //         ...values,
                //         prefix: this.state.prefix,
                //     },
                // });
            }
        });
    };

    private handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    private checkConfirm = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不匹配!');
        } else {
            callback();
        }
    };

    private checkPassword = (rule, value, callback) => {
        if (!value) {
            this.setState({
                help: '请输入密码！',
                visible: !!value,
            });
            callback('error');
        } else {
            this.setState({
                help: '',
            });
            if (!this.state.visible) {
                this.setState({
                    visible: !!value,
                });
            }
            if (value.length < 6) {
                callback('error');
            } else {
                const { form } = this.props;
                if (value && this.state.confirmDirty) {
                    form.validateFields(['confirm'], { force: true });
                }
                callback();
            }
        }
    };

    private changePrefix = value => {
        this.setState({
            prefix: value,
        });
    };

    private renderPasswordProgress = () => {
        const { form } = this.props;
        const value = form.getFieldValue('password');
        const passwordStatus = this.getPasswordStatus();
        return value && value.length ? (
            <div className={`progress-${passwordStatus}`}>
                <Progress
                    status={passwordProgressMap[passwordStatus] as "success" | "exception" | "active"}
                    className={'progress'}
                    strokeWidth={6}
                    percent={value.length * 10 > 100 ? 100 : value.length * 10}
                    showInfo={false}
                />
            </div>
        ) : null;
    };

    public render() {
        const { form, submitting } = this.props;
        const { getFieldDecorator } = form;
        const { count, prefix } = this.state;
        return (
            <div className={'main Register'}>
                <h3>注册</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem>
                        {getFieldDecorator('mail', {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入邮箱地址！',
                                },
                                {
                                    type: 'email',
                                    message: '邮箱地址格式错误！',
                                },
                            ],
                        })(<Input size="large" placeholder="邮箱" />)}
                    </FormItem>
                    <FormItem help={this.state.help}>
                        <Popover
                            content={
                                <div style={{ padding: '4px 0' }}>
                                    {passwordStatusMap[this.getPasswordStatus()]}
                                    {this.renderPasswordProgress()}
                                    <div style={{ marginTop: 10 }}>
                                        请至少输入 6 个字符。请不要使用容易被猜到的密码。
                                    </div>
                                </div>
                            }
                            overlayStyle={{ width: 240 }}
                            placement="right"
                            visible={this.state.visible}
                        >
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        validator: this.checkPassword,
                                    },
                                ],
                            })(<Input size="large" type="password" placeholder="至少6位密码，区分大小写" />)}
                        </Popover>
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: '请确认密码！',
                                },
                                {
                                    validator: this.checkConfirm,
                                },
                            ],
                        })(<Input size="large" type="password" placeholder="确认密码" />)}
                    </FormItem>
                    <FormItem>
                        <InputGroup compact={true}>
                            <Select
                                size="large"
                                value={prefix}
                                onChange={this.changePrefix}
                                style={{ width: '20%' }}
                            >
                                <Option value="86">+86</Option>
                                <Option value="87">+87</Option>
                            </Select>
                            {getFieldDecorator('mobile', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入手机号！',
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: '手机号格式错误！',
                                    },
                                ],
                            })(<Input size="large" style={{ width: '80%' }} placeholder="11位手机号" />)}
                        </InputGroup>
                    </FormItem>
                    <FormItem>
                        <Row gutter={8}>
                            <Col span={16}>
                                {getFieldDecorator('captcha', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入验证码！',
                                        },
                                    ],
                                })(<Input size="large" placeholder="验证码" />)}
                            </Col>
                            <Col span={8}>
                                <Button
                                    size="large"
                                    disabled={count?true:false}
                                    className={'getCaptcha'}
                                    onClick={this.onGetCaptcha}
                                >
                                    {count ? `${count} s` : '获取验证码'}
                                </Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <Button
                            size="large"
                            loading={submitting}
                            className={'submit'}
                            type="primary"
                            htmlType="submit"
                        >
                            注册
                        </Button>
                        <Link className={'login'} to="/user/login">
                            使用已有账户登录
                        </Link>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default Form.create()(Register);
