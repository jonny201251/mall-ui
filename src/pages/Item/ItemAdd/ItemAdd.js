import React, {PureComponent} from 'react'
import {Breadcrumb, Button, Card, Icon, InputNumber, message} from 'antd'
import Form, {FormCore, FormItem, If} from 'noform'
import {Input, Radio, Select, TreeSelect, Upload} from 'nowrapper/lib/antd'
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
const trueOrFalse = [
    {label: '是', value: 1},
    {label: '否', value: 0}
]

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
        //
        genericSpecDisplay: 'none',
        specialSpecDisplay: 'none'
    }

    constructor(props) {
        super(props);
        this.core = new FormCore({validateConfig: validate});
        this.core2 = new FormCore();
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
        if (this.state.categoryNames.length > 1) {
            return this.state.categoryNames.map((name) => <Breadcrumb.Item>{name}</Breadcrumb.Item>)
        }
    }
    onSelect = (value, node, extra) => {
        //先重置数据
        this.core.reset()
        this.core2.reset()
        this.setState({
            //商品图片
            fileList: [],
            defaultFileList: [],
            //editor
            editorState: BraftEditor.createEditorState(''),
            //
            genericSpecDisplay: 'none',
            specialSpecDisplay: 'none',
            specAll: {}
        })

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
        //根据categoryId获取规格参数
        request.get(spuPath + '/specAll?categoryId=' + categoryId).then(res => {
            if (res && res.code === 1) {
                this.setState({specAll: res.data})
            }
        })
    }

    onClick = () => {
        console.log(this.core.getValues())
        console.log(this.core2.getValues())
        console.log(JSON.stringify(this.core2.getValues()));
        return
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
                //通用规格
                formData.append('generic', JSON.stringify(this.core2.getValues()))
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

    showGenericSpec = () => {
        let arr = []
        if (this.state.specAll.genericSpec) {
            this.setState({genericSpecDisplay: ''})
            this.state.specAll.genericSpec.map(tmp => arr.push(<FormItem label={tmp.label}
                                                                         name={tmp.name} inline><Input/></FormItem>))
        }
        return arr
    }
    showSpecialSpec = () => {
        if (this.state.specAll.specialSpec) {
            this.setState({specialSpecDisplay: ''})
            return this.state.specAll.specialSpec.map(tmp => <FormItem onChange={this.skuChange} label={tmp.label}
                                                                       name={tmp.name}>
                <SelectInlineRepeater locale='zh' selectMode="multiple" multiple>
                    <FormItem label='属性值' name="value"><Input/></FormItem>
                </SelectInlineRepeater>
            </FormItem>)
        }
    }
    showSkuItem = () => {
        let arr = []
        if (this.state.specAll.specialSpec) {
            this.state.specAll.specialSpec.map(tmp => {
                arr.push(<FormItem status="disabled" label={tmp.label} name={tmp.name}
                                   defaultMinWidth={false}><Input style={{width: 120}}/></FormItem>)
            })
        }
        arr.push(<FormItem label='商品价格' name="price" defaultMinWidth={false}><InputNumber
            style={{width: 120}}/></FormItem>)
        arr.push(<FormItem label='库存' name="stock" defaultMinWidth={false}><InputNumber
            style={{width: 120}}/></FormItem>)
        arr.push(<FormItem label='商品货号' name="skuCode" defaultMinWidth={false}><Input
            style={{width: 200}}/></FormItem>)
        arr.push(<FormItem label='是否上架' name="saleable" defaultMinWidth={false}><Radio.Group
            options={trueOrFalse} style={{width: 0}}/></FormItem>)
        arr.push(<FormItem style={{display: 'none'}} name="indexes"><Input/></FormItem>)
        arr.push(<FormItem style={{display: 'none'}} name="spuSpec"><Input/></FormItem>)
        return arr
    }

    skuChange = () => {
        if (this.core.getValue('tmpPrice') != null && this.core.getValue('tmpStock') != null) {
            this.generateSkuItem()
        }
    }

    generateSkuItem = () => {
        let skuItemData = {dataSource: []}
        //取出-价格、库存
        let price = this.core.getValue('tmpPrice')
        let stock = this.core.getValue('tmpStock')
        if (this.state.specAll.specialSpec) {
            //取出特有属性
            let arr = []
            this.state.specAll.specialSpec.map(tmp => {
                //tmp：4,机身颜色
                if (this.core.getValue(tmp.name).dataSource.length > 0) {
                    let propArr = []
                    this.core.getValue(tmp.name).dataSource.map(prop => {
                        if (prop.value) {
                            propArr.push(prop.value)
                        }
                    })
                    if (propArr.length > 0) {
                        arr.push({name: tmp.name, propArr})
                    }
                }
            })
            //遍历-[{name:4,propArr:[红色，蓝色]},{[4G,8G]},{[长,宽]}]
            if (arr.length > 0) {
                if (arr.length > 5) {
                    //预设5个特有属性
                    message.warning('特有属性=' + arr.length + ',多余预设特性,请联系管理员')
                    return
                }
                //遍历
                if (arr[0]) {
                    arr[0].propArr.map(prop0 => {
                        if (arr[1]) {
                            arr[1].propArr.map(prop1 => {
                                if (arr[2]) {
                                    arr[2].propArr.map(prop2 => {
                                        if (arr[3]) {
                                            arr[3].propArr.map(prop3 => {
                                                if (arr[4]) {
                                                    arr[4].propArr.map(prop4 => {
                                                        data[arr[0].name] = prop0
                                                        data[arr[1].name] = prop1
                                                        data[arr[2].name] = prop2
                                                        data[arr[3].name] = prop3
                                                        data[arr[4].name] = prop4
                                                        data.price = price
                                                        data.stock = stock
                                                        data.saleable = 1
                                                        skuItemData.dataSource.push(data)
                                                    })
                                                } else {
                                                    data[arr[0].name] = prop0
                                                    data[arr[1].name] = prop1
                                                    data[arr[2].name] = prop2
                                                    data[arr[3].name] = prop3
                                                    data.price = price
                                                    data.stock = stock
                                                    data.saleable = 1
                                                    skuItemData.dataSource.push(data)
                                                }
                                            })
                                        } else {
                                            let data = {}
                                            data[arr[0].name] = prop0
                                            data[arr[1].name] = prop1
                                            data[arr[2].name] = prop2
                                            data.price = price
                                            data.stock = stock
                                            data.saleable = 1
                                            skuItemData.dataSource.push(data)
                                        }
                                    })
                                } else {
                                    let data = {}
                                    data[arr[0].name] = prop0
                                    data[arr[1].name] = prop1
                                    data.price = price
                                    data.stock = stock
                                    data.saleable = 1
                                    skuItemData.dataSource.push(data)
                                }
                            })
                        } else {
                            let data = {}
                            data[arr[0].name] = prop0
                            data.price = price
                            data.stock = stock
                            data.saleable = 1
                            data.indexes = '0_0_0'
                            data.skuSpec = 'aaaa'
                            skuItemData.dataSource.push(data)
                        }
                    })
                }
            } else {
                let data = {}
                data.price = price
                data.stock = stock
                data.saleable = 1
                skuItemData.dataSource.push(data)
                this.core.setValue('skuItem', skuItemData)
            }
            if (skuItemData.dataSource.length > 0) {
                this.core.setValue('skuItem', skuItemData)
            }
        } else {
            let data = {}
            data.price = price
            data.stock = stock
            data.saleable = 1
            skuItemData.dataSource.push(data)
            this.core.setValue('skuItem', skuItemData)
        }
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
                <Form core={this.core} direction="vertical-top">
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
                        <FormItem label="商品的副标题" name="subTitle"><Input/></FormItem>
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
                    <Form core={this.core2} direction="vertical-top">
                        <Card title='商品的通用属性' style={{marginTop: 10, display: this.state.genericSpecDisplay}}>
                            {this.state.specAll ? this.showGenericSpec() : ''}
                        </Card>
                    </Form>
                    <Card title='商品的特有属性' style={{marginTop: 10, display: this.state.specialSpecDisplay}}>
                        {this.state.specAll ? this.showSpecialSpec() : ''}
                    </Card>
                    <Card title='商品的其他属性' style={{marginTop: 10}}>
                        <FormItem name="speSellerDefine">
                            <SelectInlineRepeater locale='zh' selectMode="multiple" multiple>
                                <FormItem label='属性名称' name="name"><Input/></FormItem>
                                <FormItem label='属性值' name="value"><Input/></FormItem>
                            </SelectInlineRepeater>
                        </FormItem>
                    </Card>
                    <Card title='商品的价格、库存' style={{marginTop: 10}}>
                        <FormItem onChange={this.skuChange} label="商品价格" name="tmpPrice" required={true}
                                  inline><InputNumber/></FormItem>
                        <FormItem onChange={this.skuChange} label="商品库存" name="tmpStock" required={true}
                                  inline><InputNumber/></FormItem>
                        <If when={(values) => {
                            return values.tmpPrice !== null && values.tmpStock !== null
                        }}>
                            <FormItem label={<b style={{color: 'red'}}>* 库存商品</b>} name="skuItem" required={true}>
                                <SelectInlineRepeater locale='zh' selectMode="multiple" multiple>
                                    {this.state.specAll ? this.showSkuItem() : ''}
                                </SelectInlineRepeater>
                            </FormItem>
                        </If>
                    </Card>
                    <div style={{marginTop: 20}}>
                        <Button size='large' type="primary" onClick={this.onClick} style={{width: 200}}>发布</Button>
                    </div>
                </Form>
            </div>
        )
    }
}
