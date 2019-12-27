import React, {PureComponent} from 'react'
import Form, {FormCore, FormItem} from 'noform'
import {Input, TreeSelect} from 'nowrapper/lib/antd'
import request from '../../../utils/request'

const validate = {
    name: {type: "string", required: true, message: '规格组不能为空'},
    categoryId: {type: "integer", required: true, message: '商品类目不能为空'}
}
const adminControllerPath = '/mall/category'

class SpecificationGroupForm extends PureComponent {
    state = {
        treeSelectData: [],
        display: 'none'
    }

    constructor(props) {
        super(props);
        this.core = new FormCore({validateConfig: validate});
    }

    componentWillMount() {
        let {type, record, categoryId} = this.props.option

        this.core.setStatus('categoryId','disabled')
        if ('create' === type && categoryId > 0) {
            this.core.setValues({categoryId})
        } else if ('edit' === type || 'view' === type) {
            this.core.setValues({...record})
            this.core.setGlobalStatus('edit' === type ? type : 'preview')
            //显示出 排序
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
                <FormItem label="规格组" name="name" required={true}><Input/></FormItem>
                <FormItem label="商品类目" name="categoryId" required={true}>
                    <TreeSelect treeData={this.state.treeSelectData} treeDefaultExpandAll/>
                </FormItem>
                <FormItem style={{display: this.state.display}} label="排序" name="sort"
                          defaultMinWidth={false} layout={{label: 8, control: 4}}>
                    <Input/>
                </FormItem>
            </Form>
        )
    }
}

export default SpecificationGroupForm