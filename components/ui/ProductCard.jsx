"use client"
import React from 'react'
import { useState } from 'react'
import { deleteProduct, updateTargetPrice } from '@/app/Action'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Badge } from './badge'
import { Button } from './button'
import { Input } from './input'
import { ChevronsUp, ChevronsDown, TrendingDown, Loader2, Target, Check, X } from 'lucide-react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import PriceChart from './PriceChart'
import PriceStats from './PriceStats'

const ProductCard = ({ product }) => {
    const [showChart, setShowChart] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [editingTarget, setEditingTarget] = useState(false)
    const [targetInput, setTargetInput] = useState(product.target_price || "")
    const [savingTarget, setSavingTarget] = useState(false)
    const [targetPrice, setTargetPrice] = useState(product.target_price)

    const handleDelete = async () => {

        if (!confirm("Are you sure you want to delete this product?")) {
            return
        }
        setDeleting(true)
        const result = await deleteProduct(product.id)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.message || "Product deleted successfully")
        }
        setDeleting(false)
    }

    const handleSaveTarget = async () => {
        setSavingTarget(true)
        const result = await updateTargetPrice(product.id, targetInput || null)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success(result.message)
            setTargetPrice(targetInput ? parseFloat(targetInput) : null)
            setEditingTarget(false)
        }
        setSavingTarget(false)
    }

    const handleClearTarget = async () => {
        setSavingTarget(true)
        const result = await updateTargetPrice(product.id, null)
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Target price removed")
            setTargetPrice(null)
            setTargetInput("")
            setEditingTarget(false)
        }
        setSavingTarget(false)
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className={"pb-3"}>
                <div className="flex gap-4">
                    {product.img_url && (
                        <img
                            src={product.img_url}
                            alt={product.name}
                            className=" w-20 h-20 rounded-md object-cover border"
                        />
                    )}

                    <div className="flex-1 min-w-0">
                        <h3 className='font-semibold text-gray-900 
            line-clamp-2 mb-2'>{product.name}</h3>
                        <div className=' flex items-baseline gap-2 flex-wrap'>
                            <span className='text-3xl font-bold text-gray-500'>
                                {product.currency} {product.current_price}
                            </span>
                            <Badge variant="secondary" className="gap-1">
                                <TrendingDown className="w-4 h-4" />
                                Tracking
                            </Badge>
                        </div>

                        {/* Target Price Display */}
                        {targetPrice && !editingTarget && (
                            <div className="mt-2 flex items-center gap-2">
                                <Badge className="gap-1 bg-pink-100 text-pink-700 hover:bg-pink-200 cursor-pointer"
                                    onClick={() => setEditingTarget(true)}>
                                    <Target className="w-3 h-3" />
                                    Target: {product.currency} {targetPrice}
                                </Badge>
                                {parseFloat(product.current_price) <= targetPrice && (
                                    <Badge className="bg-green-100 text-green-700 text-[11px]">
                                        ✅ Below target!
                                    </Badge>
                                )}
                            </div>
                        )}

                    </div>

                </div>
            </CardHeader>
            <CardContent >
                {/* Target Price Editor */}
                {editingTarget && (
                    <div className="flex items-center gap-2 mb-3 p-3 bg-pink-50 rounded-lg border border-pink-200">
                        <Target className="w-4 h-4 text-pink-500 shrink-0" />
                        <span className="text-sm text-gray-600 shrink-0">Target:</span>
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Enter target price"
                            value={targetInput}
                            onChange={(e) => setTargetInput(e.target.value)}
                            className="h-8 w-32 text-sm"
                            disabled={savingTarget}
                        />
                        <Button size="sm" variant="ghost"
                            onClick={handleSaveTarget}
                            disabled={savingTarget || !targetInput}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                            {savingTarget ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </Button>
                        {targetPrice && (
                            <Button size="sm" variant="ghost"
                                onClick={handleClearTarget}
                                disabled={savingTarget}
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                                <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                        )}
                        <Button size="sm" variant="ghost"
                            onClick={() => setEditingTarget(false)}
                            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                <div className='flex flex-wrap gap-2'>
                    <Button variant='outline'
                        onClick={() => setShowChart(!showChart)}>
                        {showChart ? (
                            <>
                                <ChevronsUp className="w-4 h-4" />
                                Hide Chart
                            </>
                        ) : (
                            <>
                                <ChevronsDown className="w-4 h-4" />
                                Show Chart
                            </>
                        )}
                    </Button>

                    {!targetPrice && !editingTarget && (
                        <Button variant="outline" size="sm"
                            onClick={() => setEditingTarget(true)}
                            className="gap-1 text-pink-600 hover:text-pink-700 hover:bg-pink-50">
                            <Target className="w-4 h-4" />
                            Set Target Price
                        </Button>
                    )}

                    <Button variant="outline"
                        size="sm" asChild className="gap-1" >
                        <Link href={product.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            Visit Product
                        </Link>

                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        {deleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                Remove
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
            {showChart && (<CardFooter className="pt-0 flex-col">
                <PriceChart productId={product.id} currentPrice={product.current_price} currency={product.currency} targetPrice={targetPrice} />
                <PriceStats productId={product.id} currentPrice={product.current_price} currency={product.currency} />
            </CardFooter>)}
        </Card>
    );
}

export default ProductCard