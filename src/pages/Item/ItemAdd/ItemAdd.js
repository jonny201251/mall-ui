import React, {PureComponent} from 'react'
import {Button, message, Steps, Breadcrumb, Card, Icon} from 'antd'
import Form, {FormCore, FormItem} from 'noform'
import {Input, Radio, TreeSelect, Select, InputNumber, Upload} from 'nowrapper/lib/antd'
import {InlineRepeater, Selectify} from 'nowrapper/lib/antd/repeater'
import request from '../../../utils/request'
import uploadStyle from './upload.less'
//editor
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import {ContentUtils} from 'braft-utils'

const SelectInlineRepeater = Selectify(InlineRepeater)

const validate = {
    categoryId: {type: "number", required: true, message: '商品类目不能为空'},
    title: {type: "string", required: true, message: '商品标题不能为空'},
    brandId: {type: "number", required: true, message: '品牌不能为空'},
    tmpPrice: {type: "number", required: true, message: '商品价格不能为空'},
    tmpStock: {type: "number", required: true, message: '商品库存不能为空'},
}

const categoryPath = '/mall/category'
const spuPath = '/mall/spu'
const brandPath = '/mall/brand'
const hostPath = 'http://localhost:8082/mall'
export default class ItemAdd extends PureComponent {
    state = {
        treeSelectData: [],
        //商品图片
        fileList: [],
        defaultFileList: [],
        //editor
        editorState: BraftEditor.createEditorState(''),
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

    //editor
    handleChange = (editorState) => {
        this.setState({
            editorState: editorState,
            outputHTML: editorState.toHTML()
        })
    }
    uploadHandler = (param) => {
        if (!param.file) {
            return false
        }
        if (param.file.type.indexOf('image') === -1) {
            message.warning('上传的不是图片')
            return
        }
        //将图片上传到后台
        const formData = new FormData();
        formData.append('imageFile', param.file)
        //异步请求
        request.post(spuPath + '/uploadImage', {data: formData}).then(res => {
            if (res && res.code === 1) {
                this.setState({
                    editorState: ContentUtils.insertMedias(this.state.editorState, [{
                        type: 'IMAGE',
                        url: hostPath + res.data
                    }])
                })
            } else {
                message.error("上传图片失败！")
            }
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
        console.log(this.core.getValues())
        this.core.validate((err) => {
            if (!err) {
                //校验商品图片
                if (this.state.fileList.length === 0) {
                    message.warning('请上传商品图片')
                    return
                }
                //准备附件数据
                const formData = new FormData();
                this.state.fileList.forEach((file) => {
                    formData.append('files', file)
                })
                //商品描述数据
                formData.append('description', this.state.outputHTML)
                //表单数据
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
        })
    }

    render() {
        //editor
        const extendControls = [
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload
                        accept="image/*"
                        showUploadList={false}
                        customRequest={this.uploadHandler}
                    >
                        {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                        <button type="button" className="control-item button upload-button" data-title="插入图片">
                            <Icon type="picture" theme="filled"/>
                        </button>
                    </Upload>
                )
            }
        ]
        return (
            <div>
                <Form core={this.core}>
                    <FormItem style={{display: 'none'}} name="id"><Input/></FormItem>
                    <Card title='商品的类目'>
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
                    <Card title='商品的基本信息' style={{marginTop: 10}}>
                        <FormItem label="商品标题" name="title" required={true}><Input/></FormItem>
                        <FormItem label="副标题" name="subTitle"><Input/></FormItem>
                        <FormItem label="品牌" name="brandId" required={true}><Select
                            options={this.state.brandSelectOptions}
                            required={true}/></FormItem>
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
                        <FormItem label="包装清单" name="packingList"><Input.TextArea/></FormItem>
                        <FormItem label="售后服务" name="afterService"><Input.TextArea/></FormItem>
                    </Card>
                    <Card title='商品的描述' style={{marginTop: 10}}>
                        <div className="editor-wrapper">
                            <BraftEditor
                                value={this.state.editorState}
                                onChange={this.handleChange}
                                extendControls={extendControls}
                                excludeControls={['media', 'fullscreen']}
                                contentStyle={{height: 400}}
                            />
                        </div>
                    </Card>
                    <Card title='商品的通用属性' style={{marginTop: 10}}>

                    </Card>
                    <Card title='商品的特有属性' style={{marginTop: 10}}>

                    </Card>
                    <Card title='商品的其他属性' style={{marginTop: 10}}>
                        <FormItem name="spec_seller_define">
                            <SelectInlineRepeater locale='zh' selectMode="multiple" multiple>
                                <FormItem label='属性名称' name="name"><Input/></FormItem>
                                <FormItem label='属性值' name="value"><Input/></FormItem>
                            </SelectInlineRepeater>
                        </FormItem>
                    </Card>
                    <Card title='商品的价格、库存' style={{marginTop: 10}}>
                        <FormItem label="商品价格" name="tmpPrice" required={true}><InputNumber/></FormItem>
                        <FormItem label="商品库存" name="tmpStock" required={true}><InputNumber/></FormItem>
                    </Card>
                    <div style={{marginTop: 20}}>
                        <Button size='large' type="primary" onClick={this.onClick} style={{width:200}}>发布</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
