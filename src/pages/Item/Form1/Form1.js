import React, {PureComponent} from 'react'
import {Icon, Row, Col} from 'antd'
import Form, {FormItem, FormCore} from 'noform'
import {Input, Cascader, Upload} from 'nowrapper/lib/antd'
import request from '../../../utils/request'

const validate = {
    categoryArr: {type: "string", required: true, message: '类目名称不能为空'}
}
const adminControllerPath = '/mall/category'
export default class Form1 extends PureComponent {
    state = {
        cascadeData: [],
    }

    constructor(props) {
        super(props);
        this.core = new FormCore({validateConfig: validate});
    }

    componentWillMount() {
        //取出 商品类目
        request.get(adminControllerPath + '/cascade').then(res => {
            if (res && res.code === 1) {
                this.setState({cascadeData: res.data})
            }
        })
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    filter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    validate22 = () => {
        alert('validate')
    }

    render() {
        return (
            <Form core={this.core} >
                <FormItem name="categoryArr">
                    <Cascader size='large' options={this.state.cascadeData} changeOnSelect={true}
                              showSearch={() => this.search(inputValue, path)} placeholder={'请选择商品类目'}/>
                </FormItem>
            </Form>
        )
    }
}