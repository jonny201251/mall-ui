import React, {PureComponent} from 'react'
import Form, {FormItem, FormCore} from 'noform'
import {Input, Select} from 'nowrapper/lib/antd'
import {InlineRepeater, Selectify} from 'nowrapper/lib/antd/repeater'
import request from '../../utils/request'

let SelectInlineRepeater = Selectify(InlineRepeater)

const validate = {
    name: {type: "string", required: true, message: '分厂名称不能为空'}
}
const factoryPath = '/mall/factory'

class FactoryUserForm extends PureComponent {
    state = {
        selectData: []
    }

    constructor(props) {
        super(props);
        this.core = new FormCore({validateConfig: validate});
    }

    componentWillMount() {
        //取出分厂
        request.get(factoryPath + '/factoryList').then(res => {
            if (res && res.code === 1) {
                this.setState({selectData: res.data})
            }
        })
        let {type, record} = this.props.option
        if ('edit' === type || 'view' === type) {
            this.core.setValues({...record})
            this.core.setGlobalStatus('edit' === type ? type : 'preview')
        }
    }

    render() {
        return (
            <Form core={this.core} layout={{label: 8, control: 16}} direction="vertical-top">
                <FormItem label="分厂名称" name="companyId" required={true}>
                    <Select options={this.state.selectData}/>
                </FormItem>
                <FormItem name="users">
                    <SelectInlineRepeater locale='zh' selectMode="multiple" multiple>
                        <FormItem label='登录名' name="loginName" defaultMinWidth={false}><Input
                            style={{width: 120}}/></FormItem>
                        <FormItem label='登录密码' name="loginPassword" defaultMinWidth={false}><Input
                            style={{width: 120}}/></FormItem>
                    </SelectInlineRepeater>
                </FormItem>
            </Form>
        )
    }
}

export default FactoryUserForm