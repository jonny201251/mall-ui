import React, {PureComponent} from 'react'
import {Button, message, Steps, Breadcrumb, Card} from 'antd'
import Form, {FormCore, FormItem} from 'noform'
import {Input, Radio, TreeSelect, Select} from 'nowrapper/lib/antd'
import request from '../../../utils/request'


const validate = {
    name: {type: "number", required: true, message: '类目名称不能为空'}
}

const categoryPath = '/mall/category'
const spuPath = '/mall/spu'
export default class ItemAdd extends PureComponent {
    state = {
        treeSelectData: [],
    }

    constructor(props) {
        super(props);
        this.core = new FormCore({validateConfig: validate});
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
    }

    showSpec = () => {

    }

    render() {
        return (
            <div>
                <Form core={this.core}>
                    <FormItem style={{display: 'none'}} name="id"><Input/></FormItem>
                    <Card title='1.请选择商品类目'>
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
                    <Card title='2.填写商品信息' style={{marginTop: 20}}>
                        <FormItem label="商品标题" name="title" required={true}><Input/></FormItem>
                    </Card>
                </Form>
            </div>
        )
    }
}
