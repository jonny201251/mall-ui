import React, {PureComponent} from 'react'
import {Button, message, Steps, Breadcrumb, Card, Icon} from 'antd'
import Form, {FormCore, FormItem} from 'noform'
import {Input, Radio, TreeSelect, Select, InputNumber, Upload} from 'nowrapper/lib/antd'
import request from '../../../utils/request'
import uploadStyle from './upload.less'
import styles from "../../ImageRichText/upload.less";

const validate = {
    name: {type: "number", required: true, message: '类目名称不能为空'}
}

const categoryPath = '/mall/category'
const spuPath = '/mall/spu'
const brandPath = '/mall/brand'
export default class ItemAdd extends PureComponent {
    state = {
        treeSelectData: [],
        //商品图片
        fileList: [],
        defaultFileList: [],
    }

    constructor(props) {
        super(props);
        this.core = new FormCore({validateConfig: validate});
    }

    //商品图片
    beforeUpload = file => {
        this.setState({fileList: [...this.state.fileList, file]})
        return false
    }
    onRemove = file => {
        this.setState(state => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {fileList: newFileList}
        })
    }

    componentWillMount() {
        //取出 商品类目
        request.get(categoryPath + '/treeSelect').then(res => {
            if (res && res.code === 1) {
                this.setState({treeSelectData: res.data})
            }
        })
    }

    showCategoryNames = () => {
        return this.state.categoryNames.map((name) => <Breadcrumb.Item>{name}</Breadcrumb.Item>)
    }

    onSelect = (value, node, extra) => {
        let categoryId = value
        this.setState({categoryId})
        // let title = node.props.title
        //根据categoryId获取所有父级节点的名称
        request.get(categoryPath + '/categoryNames?categoryId=' + categoryId).then(res => {
            if (res && res.code === 1) {
                this.setState({categoryNames: res.data})
            }
        })
        //根据categoryId获取商品类目，从而判断出显示哪个商品规格
        request.get(spuPath + '/specType?categoryId=' + categoryId).then(res => {
            if (res && res.code === 1) {
                this.setState({specType: res.data})
            }
        })
        //根据categoryId获取品牌
        request.get(brandPath + '/selectOptions?categoryId=' + categoryId).then(res => {
            if (res && res.code === 1) {
                this.setState({brandSelectOptions: res.data})
            }
        })
    }

    showSpec = () => {

    }

    onClick = () => {
        //准备附件数据
        const formData = new FormData();
        this.state.fileList.forEach((file) => {
            formData.append('files', file)
        })
        //将表单数据放入formData
        formData.append("form", JSON.stringify(this.core.getValues()))
        //异步请求
        request.post(spuPath + '/add', {data: formData}).then(res => {
            if (res && res.code === 1) {
                message.success("操作成功")
            } else {
                message.error("操作失败")
            }
        })
    }

    render() {
        return (
            <div>
                <Form core={this.core}>
                    <FormItem style={{display: 'none'}} name="id"><Input/></FormItem>
                    <Card title='请选择商品类目'>
                        <FormItem name="categoryId">
                            <TreeSelect size={'large'} treeData={this.state.treeSelectData} treeDefaultExpandAll
                                        onSelect={(value, node, extra,) => this.onSelect(value, node, extra)}/>
                        </FormItem>
                        <div style={{marginTop: 20}}>
                            <Breadcrumb style={{fontSize: 18}} separator=">">
                                {this.state.categoryNames ? this.showCategoryNames() : ''}
                            </Breadcrumb>
                        </div>
                    </Card>
                    <Card title='填写商品信息' style={{marginTop: 20}}>
                        <FormItem label="商品标题" name="title" required={true}><Input/></FormItem>
                        <FormItem label="副标题" name="subTitle" required={true}><Input/></FormItem>
                        <FormItem label="品牌" name="brandId"><Select options={this.state.brandSelectOptions}
                                                                    required={true}/></FormItem>
                        <FormItem label="商品价格" name="tmpPrice" required={true}><InputNumber/></FormItem>
                        <FormItem label="商品库存" name="tmpStock" required={true}><InputNumber/></FormItem>
                        <FormItem label="商品图片" required={true}/>
                        <div style={{width: 400}}>
                            <Upload.Dragger listType='picture'
                                            beforeUpload={this.beforeUpload} onRemove={this.onRemove}
                                            className={uploadStyle.upload} defaultFileList={this.state.defaultFileList}>
                                <p className="ant-upload-drag-icon">
                                    <Icon type="plus"/>
                                </p>
                            </Upload.Dragger>
                        </div>
                    </Card>
                    <div style={{marginTop: 20}}>
                        <Button type="primary" onClick={this.onClick}>发布</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
