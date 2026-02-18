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
import PriceHistoryTable from './PriceHistoryTable'

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
        <Card className="bg-card border-border hover:border-primary/30 transition-all duration-500 overflow-hidden group shadow-sm hover:shadow-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <CardHeader className="pb-6">
                <div className="flex gap-6">
                    {product.img_url && (
                        <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-border bg-muted/30">
                            <img
                                src={product.img_url}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-bold text-foreground text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-3xl font-black text-primary">
                                {product.currency} {product.current_price}
                            </span>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold px-3 py-1">
                                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                                Tracking
                            </Badge>
                        </div>

                        {/* Target Price Display */}
                        {targetPrice && !editingTarget && (
                            <div className="flex items-center gap-2 pt-1 transition-all animate-in fade-in slide-in-from-left-2">
                                <Badge
                                    className="gap-1.5 bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer border-none px-3 py-1.5 rounded-full shadow-sm"
                                    onClick={() => setEditingTarget(true)}
                                >
                                    <Target className="w-3.5 h-3.5" />
                                    Target: {product.currency} {targetPrice}
                                </Badge>
                                {parseFloat(product.current_price) <= targetPrice && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-full text-xs font-bold animate-pulse">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        Below Target
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Target Price Editor */}
                {editingTarget && (
                    <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-2xl border border-primary/20 animate-in zoom-in-95 duration-300">
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Target className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target</span>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={targetInput}
                                onChange={(e) => setTargetInput(e.target.value)}
                                className="h-10 bg-background border-border text-sm font-bold focus-visible:ring-primary/30"
                                disabled={savingTarget}
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost"
                                onClick={handleSaveTarget}
                                disabled={savingTarget || !targetInput}
                                className="h-10 w-10 text-green-500 hover:bg-green-500/10">
                                {savingTarget ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
                            </Button>
                            {targetPrice && (
                                <Button size="icon" variant="ghost"
                                    onClick={handleClearTarget}
                                    disabled={savingTarget}
                                    className="h-10 w-10 text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                            <Button size="icon" variant="ghost"
                                onClick={() => setEditingTarget(false)}
                                className="h-10 w-10 text-muted-foreground hover:bg-muted">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <Button
                        variant={showChart ? "secondary" : "outline"}
                        className={`font-bold transition-all duration-300 rounded-xl ${showChart ? 'bg-primary/20 text-primary border-primary/30' : ''}`}
                        onClick={() => setShowChart(!showChart)}
                    >
                        {showChart ? (
                            <>
                                <ChevronsUp className="w-4 h-4 mr-2" />
                                Hide Insights
                            </>
                        ) : (
                            <>
                                <ChevronsDown className="w-4 h-4 mr-2" />
                                Show Insights
                            </>
                        )}
                    </Button>

                    {!targetPrice && !editingTarget && (
                        <Button variant="outline"
                            onClick={() => setEditingTarget(true)}
                            className="font-bold rounded-xl border-primary/20 text-primary hover:bg-primary/10 transition-colors">
                            <Target className="w-4 h-4 mr-2" />
                            Set Target
                        </Button>
                    )}

                    <Button variant="outline" asChild className="font-bold rounded-xl">
                        <Link href={product.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Buy Now
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="font-bold text-destructive hover:bg-destructive/10 rounded-xl ml-auto"
                    >
                        {deleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </CardContent>
            {showChart && (
                <CardFooter className="pt-6 flex-col gap-8 bg-secondary/20 border-t border-border animate-in slide-in-from-top-4 duration-500">
                    <div className="w-full space-y-8">
                        <PriceChart productId={product.id} currentPrice={product.current_price} currency={product.currency} targetPrice={targetPrice} />
                        <PriceStats productId={product.id} currentPrice={product.current_price} currency={product.currency} />
                        <PriceHistoryTable productId={product.id} currency={product.currency} />
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}

export default ProductCard