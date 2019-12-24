import React, {PureComponent} from 'react'
import {Icon, Row, Col} from 'antd'
import Form, {FormItem, FormCore} from 'noform'
import {Input, TreeSelect, Upload} from 'nowrapper/lib/antd'
import request from '../../utils/request'
import styles from './upload.less'

const validate = {
    name: {type: "string", required: true, message: '品牌名称不能为空'}
}
const adminControllerPath = '/mall/category'

class CRUDForm extends PureComponent {
    state = {
        treeSelectData: [],
        display: 'none',
        defaultFileList: []
    }

    constructor(props) {
        super(props);
        this.core = new FormCore({validateConfig: validate});
    }

    beforeUpload = file => {
        this.props.putFileToState(file)
        return false
    }
    onRemove = file => {
        this.props.removeFileFromState(file)
    }

    componentWillMount() {
        let {type, record} = this.props.option
        if ('edit' === type || 'view' === type) {
            this.core.setValues({...record})
            this.core.setGlobalStatus('edit' === type ? type : 'preview')
            //显示出 排序
            this.setState({display: 'block'})
            //处理一下附件
            record.image && this.setState({
                defaultFileList: [{
                    uid: 1,
                    name: (record.image.split('/'))[3],
                    status: 'done'
                }]
            })
        }else{
            this.core.setValues({categoryArr:[]})
        }
        //取出 商品类目
        request.get(adminControllerPath + '/treeSelect').then(res => {
            if (res && res.code === 1) {
                this.setState({treeSelectData: res.data})
            }
        })
    }

    filter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    render() {
        return (
            <Form core={this.core} layout={{label: 8, control: 16}}>
                <FormItem style={{display: 'none'}} name="id"><Input/></FormItem>
                <FormItem label="品牌名称" name="name" required={true}><Input/></FormItem>
                <FormItem label="LOGO首字母" name="letter"><Input/></FormItem>
                <FormItem label="商品类目" name="categoryArr" required={true}>
                    <TreeSelect treeData={this.state.treeSelectData}  treeCheckable showCheckedStrategy={TreeSelect.SHOW_PARENT}/>
                </FormItem>
                <FormItem label="品牌LOGO"/>
                <div style={{paddingLeft: 112}}>
                    <Upload.Dragger listType='text '
                                    beforeUpload={this.beforeUpload} onRemove={this.onRemove}
                                    className={styles.upload} defaultFileList={this.state.defaultFileList}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="plus"/>
                        </p>
                    </Upload.Dragger>
                </div>
                <FormItem style={{display: this.state.display, marginTop: 15}} label="排序" name="sort"
                          defaultMinWidth={false} layout={{label: 8, control: 4}}>
                    <Input/>
                </FormItem>
                <FormItem label="备注" name="comment"><Input.TextArea/></FormItem>
            </Form>
        )
    }
}

export default CRUDForm