import React, {PureComponent} from 'react'
import {Modal, message} from 'antd'
import List, {Filter, Table, Pagination} from 'nolist/lib/wrapper/antd'
import {Input, Dialog, Button} from 'nowrapper/lib/antd'
import classNames from 'classnames'
import styles from '../common.less'

import request from '../../utils/request'
import router from 'umi/router'

let globalList
const spuPath = '/mall/spu'
const hostName = ''
const hostPath = 'http://localhost:8082/mall'

class ItemList extends PureComponent {
    state = {}
    handleOperator = (type) => {
        if ('create' === type) {
            router.push('/itemAdd')
        } else if ('delete' === type) {
            if (this.state.record === undefined) {
                message.warning('请先单击一条数据!')
                return
            }
            Dialog.show({
                title: '提示',
                footerAlign: 'label',
                locale: 'zh',
                width: 400,
                content: <p>确定要删除<span style={{fontWeight: 'bold'}}>类目名称=<span
                    style={{color: 'red'}}>{this.state.record.name}</span></span>的数据吗?</p>,
                onOk: (values, hide) => {
                    hide()
                    request(spuPath + '/delete?id=' + this.state.record.id).then(res => {
                        if (res && res.code === 1) {
                            globalList.refresh()
                            message.success("删除成功")
                        } else {
                            Modal.error({
                                title: '错误提示',
                                content: res.msg || "删除失败"
                            })
                        }
                    })
                }
            })
        }
    }

    handleError = (err) => {
        console.log('err', err);
    }

    onMount = (list) => {
        this.list = globalList = list;
    }

    clickOperation = (type, record) => {
        this.setState({record})
        if ('onDoubleClick' === type) {
            this.handleOperator('edit')
        }
    }

    renderOperation = (text, record, idx) => {
        return (<div>
            <a href={hostName + "/itemEdit?spuId=" + record.id}>编辑</a>
            <a style={{paddingLeft: 10}} href={hostPath + "/item.html?id=" + record.id} target={'blank'}>查看</a>
        </div>)
    }

    render() {
        return (
            <List url={spuPath + '/list'} onError={this.handleError} onMount={this.onMount}>
                <Filter cols={5}>
                    <Filter.Item label="username" name="username"><Input/></Filter.Item>
                    <Filter.Item label="age" name="age"><Input/></Filter.Item>
                </Filter>
                {/*                <div className={classNames(styles.marginTop10, styles.marginBottom10)}>
                    <Button icon="plus" type="primary" onClick={() => this.handleOperator('create')}>发布商品</Button>
                    <Button icon="delete" type="primary" onClick={() => this.handleOperator('delete')}
                            className={styles.marginLeft20}>删除</Button>
                </div>*/}
                <Table onRow={record => {
                    return {
                        onClick: () => this.clickOperation('onClick', record),
                        onDoubleClick: () => this.clickOperation('onDoubleClick', record)
                    }
                }}>
                    <Table.Column title="标题" dataIndex="title"/>
                    <Table.Column title="价格" dataIndex="tmpPrice"/>
                    <Table.Column title="库存" dataIndex="tmpStock"/>
                    <Table.Column title="操作" render={this.renderOperation}/>
                </Table>
                <Pagination/>
            </List>
        )
    }
}

export default ItemList