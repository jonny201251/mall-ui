import React, {PureComponent} from 'react'
import Form, {FormItem, FormCore} from 'noform'
import {Input, TreeSelect, Radio} from 'nowrapper/lib/antd'
import request from '../../utils/request'

const validate = {
    name: {type: "string", required: true, message: '类目名称不能为空'}
}
const statusValues = [
    {label: '正常', value: 1},
    {label: '禁用', value: 0}
]
const adminControllerPath = '/mall/category'

class ItemForm extends PureComponent {
    state = {
        treeSelectData: [],
        display: 'none'
    }

    constructor(props) {
        super(props);
        this.core = new FormCore({validateConfig: validate});
    }

    componentWillMount() {
        let {type, record} = this.props.option
        if ('edit' === type || 'view' === type) {
            this.core.setValues({...record})
            this.core.setGlobalStatus('edit' === type ? type : 'preview')
            //显示出 排序和使用状态
            this.setState({display: 'block'})
        }
        //取出 上级类目
        request.get(adminControllerPath + '/treeSelect').then(res => {
            if (res && res.code === 1) {
                this.setState({treeSelectData: res.data})
            }
        })
    }

    render() {
        return (
            <Form core={this.core} layout={{label: 8, control: 16}}>
                <FormItem style={{display: 'none'}} name="id"><Input/></FormItem>
                <FormItem label="类目名称" name="name" required={true}><Input/></FormItem>
                <FormItem label="上级类目" name="pid">
                    <TreeSelect treeData={this.state.treeSelectData} treeDefaultExpandAll/>
                </FormItem>
                <FormItem style={{display: this.state.display}} label="使用状态" name="status">
                    <Radio.Group options={statusValues}/>
                </FormItem>
                <FormItem style={{display: this.state.display}} label="排序" name="sort"
                          defaultMinWidth={false} layout={{label: 8, control: 4}}>
                    <Input/>
                </FormItem>
                <FormItem label="备注" name="comment"><Input.TextArea/></FormItem>
            </Form>
        )
    }
}

export default ItemForm