'use strict'

import Company from "./company.model.js"
import path from 'path'
import fs from 'fs'
import x1 from 'excel4node'

export const getCompanies = async (req, res) => {
    try {
        const { limit = 20, skip = 0, sort, category, years } = req.query
        let filter = {}

        if (category) filter.businessCategory = category
        if (years) filter.yearsOfExperience = Number(years)

        const companies = await Company.find(filter)
            .skip(Number(skip))
            .limit(Number(limit))
            .sort(sort ? { name: sort === 'A-Z' ? 1 : -1 }: {})
        
        if(companies.length === 0) {
            return res.status(400).send(
                {
                    success: false,
                    message: 'No companies found'
                }
            )
        }

        return res.status(200).send(
            {
                success: true,
                message: 'Companies found:',
                companies
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error fetching companies',
                err
            }
        )
    }
}


export const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)

        if (!company) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Company not found'
                }
            )
        }
        return res.status(200).send(
            {
                success: true,
                company
            }
        )
    }  catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error retrieving company',
                err
            }
        )
    }

}


export const createCompany = async (req, res) => {
    try {
        const { name, address, phone, email, impactLevel, yearsOfExperience, businessCategory } = req.body
        
        const newCompany = new Company(
            {
                name,
                address,
                phone,
                email,
                impactLevel,
                yearsOfExperience,
                businessCategory
            }
        )

        await newCompany.save()
        await generateReport(req,res)
        return res.status(201).send(
            {
                success: true,
                message: 'Company created successfully',
                newCompany
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error creating company',
                err
            }
        )
    }
}

export const updateCompany = async (req,res) => {
    try {
        const { id } = req.params
        const { name, address, phone, email, impactLevel, yearsOfExperience, businessCategory} = req.body

        const company = await Company.findById(id)

        if (!company) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'Company not found'
                }
            )
        }

        const updatedCompany = await Company.findByIdAndUpdate(id, {
                name,
                address,
                phone,
                email,
                impactLevel,
                yearsOfExperience,
                businessCategory
            }, 
            { new: true }
        )

        await generateReport(req,res)
        return res.send(
            {
                success: true,
                message: 'Company updated successfully',
                updatedCompany
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                succes: false,
                message: 'Error updating company',
                err
            }
        )
    }
}

export const generateReport = async (req, res) => {
    try {
        const companies = await Company.find()

        if (!companies.length) {
            return res.status(404).send(
                {
                    success: false,
                    message: 'No companies found'
                }
            )
        }

        const reportsDir = path.join(process.cwd(), 'company')

        if(!fs.existsSync(reportsDir)){
            fs.mkdirSync(reportsDir, 
                {
                    recursive: true
                }
            )
        }

        const filePath = path.join(reportsDir, 'Empresas.xlsx')

        const wb = new x1.Workbook()
        
        const ws = wb.addWorksheet('Companies')

        const headerStyle = wb.createStyle(
            {
                font: {
                    bold: true,
                    color: '#FFFFFF'
                },
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    fgColor: '#4F81BD'
                },
                alignment: {
                    horizontal: 'center'
                }
            }
        )

        const header = [
            'Name', 'Address', 'Phone', 'Email', 'Impact Level', 'Years of Experience', 'Business Category'
        ]
        
        header.forEach((header, col) => {
                ws.cell(1, col + 1).string(header).style(headerStyle)
            }
        )

        companies.forEach((company, row) => {
                ws 
                    .cell(row + 2, 1)
                    .string(company.name)
                ws
                    .cell(row + 2, 2)
                    .string(company.address)
                ws
                    .cell(row + 2, 3)
                    .string(company.phone)
                ws
                    .cell(row + 2, 4)
                    .string(company.email)
                ws 
                    .cell(row + 2, 5)
                    .string(company.impactLevel)
                ws
                    .cell(row + 2, 6)
                    .number(company.yearsOfExperience)
                ws
                    .cell(row + 2, 7)
                    .string(company.businessCategory)
            }
        )

        wb
            .write(filePath, (err) => {
                    if (err) {
                        console.error(err)
                        return res.status(500).send(
                            {
                                success: false,
                                message: 'Error generating Excel file'
                            }
                        )
                    }

                    if (res.headersSent) {
                        console.warn("Headers already sent, skipping download.")
                        return
                    }
                    
                    res.download(filePath, 'Empresas.xlsx', (err) => {
                        if (err) {
                            console.error(err)
                            return res.status(500).send(
                                {
                                    success: false,
                                    message: 'Error sending Excel file'
                                }
                            )
                        }

                        fs.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error deleting file:', unlinkErr)
                            }
                        }   
                        )   
                    }
                )
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                success: false,
                message: 'Error generating report',
                err
            }
        )
    }
}